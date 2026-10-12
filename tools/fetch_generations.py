"""Extend the existing Kanto game with all nine generations from PokéAPI CSVs.
Keeps authored Kanto moves/PMD animation sheets; adds legal kits and local sprites.
"""
import concurrent.futures,csv,io,json,re,time,urllib.request
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'dist'/'assets'
CACHE=Path('/tmp/frontera-national-csv');CACHE.mkdir(exist_ok=True)
BASE='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
def fetch(url):
 for attempt in range(3):
  try:return urllib.request.urlopen(url,timeout=120).read()
  except Exception:
   if attempt==2:raise
   time.sleep(.2)
def table(name):
 p=CACHE/name
 if not p.exists():p.write_bytes(fetch(BASE+name))
 return list(csv.DictReader(p.open()))
def readvar(path,name):return json.loads(re.search(r'window\.'+name+r'=(.*?);(?:\n|$)',path.read_text()).group(1))
def writevars(path,values):path.write_text('\n'.join('window.'+name+'='+json.dumps(value,ensure_ascii=False,separators=(',',':'))+';' for name,value in values.items()))
files=['pokemon.csv','pokemon_species.csv','pokemon_species_names.csv','pokemon_stats.csv','pokemon_types.csv','types.csv','pokemon_evolution.csv','type_efficacy.csv','moves.csv','move_names.csv']
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as pool: tables=dict(zip(files,pool.map(table,files)))
species={int(r['id']):r for r in tables['pokemon_species.csv'] if 1<=int(r['generation_id'])<=9}
ids=sorted(species);pokemon={int(r['species_id']):r for r in tables['pokemon.csv'] if r['is_default']=='1' and int(r['species_id'])in species}
names={int(r['pokemon_species_id']):r['name'] for r in tables['pokemon_species_names.csv'] if r['local_language_id']=='7'}
types={r['id']:r['identifier']for r in tables['types.csv']};stats={};ptypes={}
for r in tables['pokemon_stats.csv']:stats.setdefault(int(r['pokemon_id']),{})[int(r['stat_id'])]=int(r['base_stat'])
for r in tables['pokemon_types.csv']:ptypes.setdefault(int(r['pokemon_id']),{})[int(r['slot'])]=types[r['type_id']]
data={i:{'id':i,'name':names.get(i,pokemon[i]['identifier'].capitalize()),'base':[stats[int(pokemon[i]['id'])][n]for n in range(1,7)],'types':[v for k,v in sorted(ptypes[int(pokemon[i]['id'])].items())],'baseExp':int(pokemon[i]['base_experience']or 100),'height':int(pokemon[i]['height']),'rare':species[i]['is_legendary']=='1'or species[i]['is_mythical']=='1','generation':int(species[i]['generation_id'])}for i in ids}
prior_evolutions=readvar(ROOT/'species.js','EVOLUTION_DATA')
evos={}
for row in tables['pokemon_evolution.csv']:
 target=int(row['evolved_species_id']);parent=species.get(target,{}).get('evolves_from_species_id')
 if not parent or int(parent)not in species:continue
 cost=0 if row['evolution_trigger_id']=='1'else 3
 option={'target':target,'level':int(row['minimum_level']or (1 if cost else 18)),'cost':cost,'method':'fragmentos'if cost else 'nivel'}
 bucket=evos.setdefault(parent,[])
 if not any(v['target']==target for v in bucket):bucket.append(option)
# Preserve the original authored Kanto thresholds for existing adventures.
for parent,options in prior_evolutions.items():
 if int(parent)<=151:
  for option in options:
   if option['target']<=151:
    target=next((v for v in evos.get(int(parent),[])if v['target']==option['target']),None)
    if target is not None:target.update(option)
chart={}
for r in tables['type_efficacy.csv']:
 if r['damage_type_id']in types and r['target_type_id']in types and int(r['damage_factor'])!=100:chart.setdefault(types[r['damage_type_id']],{})[types[r['target_type_id']]]=int(r['damage_factor'])/100
# Preserve curated Kanto kits and engine move semantics.
md=readvar(ROOT/'moves.js','MOVE_DATA');kits=readvar(ROOT/'moves.js','SPECIES_KITS')
canonical={int(r['id']):r for r in tables['moves.csv']};byname={r['identifier']:int(r['id'])for r in canonical.values()};mnames={int(r['move_id']):r['name']for r in tables['move_names.csv']if r['local_language_id']=='7'}
movefile=CACHE/'pokemon_moves.csv'
if not movefile.exists():movefile.write_bytes(fetch(BASE+'pokemon_moves.csv'))
legal={i:set()for i in ids};pid_to_species={int(p['id']):i for i,p in pokemon.items()}
fieldkeys=['cut','fly','surf','strength','flash','rock-smash','waterfall','dig','teleport'];fieldids={byname[k]:k for k in fieldkeys};field={k:set()for k in fieldkeys}
with movefile.open()as source:
 for row in csv.DictReader(source):
  i=pid_to_species.get(int(row['pokemon_id']))
  if i is None:continue
  m=int(row['move_id']);legal[i].add(m)
  if m in fieldids:field[fieldids[m]].add(i)
# Evolved forms retain learned techniques, including evolutions across generations.
for _ in range(8):
 for parent,options in evos.items():
  for option in options:legal[option['target']].update(legal[int(parent)])
extra=readvar(ROOT/'moves.js','EXTRA_MOVE_RULES')if 'window.EXTRA_MOVE_RULES='in (ROOT/'moves.js').read_text()else {};visuals={'fire':'fire','water':'water','grass':'leaf','electric':'electric','ice':'ice','psychic':'psychic','ghost':'ghost','dark':'bite','dragon':'dragon','steel':'metal','ground':'ground','rock':'rock','flying':'wind','bug':'needle','poison':'sludge','fairy':'psychic','fighting':'chop','normal':'impact'}
def register(mid):
 m=canonical[mid];key=m['identifier'];typ=types[m['type_id']];status=m['damage_class_id']=='1';power=int(m['power']or 0)
 if key not in md:
  md[key]={'id':mid,'name':mnames.get(mid,key),'type':typ,'power':power,'special':m['damage_class_id']=='3'}
  if status:
   if any(w in key for w in ['recover','heal','wish','rest','synthesis']):rule={'kind':'self','effect':'regen','duration':7,'description':'Recupera vida gradualmente'}
   elif any(w in key for w in ['protect','defense','guard','barrier','safeguard']):rule={'kind':'self','effect':'shield','duration':7,'description':'Defensa temporal'}
   elif any(w in key for w in ['dance','work-up','howl','focus','hone','plot']):rule={'kind':'self','effect':'focus','duration':7,'description':'Potencia temporal'}
   elif any(w in key for w in ['poison','toxic']):rule={'kind':'projectile','effect':'poison','duration':7,'description':'Aplica veneno'}
   elif any(w in key for w in ['sleep','yawn','spore','hypnosis']):rule={'kind':'projectile','effect':'sleep','duration':2,'description':'Aplica sueño'}
   else:rule={'kind':'cone','range':280,'effect':'attackDown','duration':7,'description':'Distrae y baja el ataque rival'}
  else:
   rule={'kind':'projectile'if m['damage_class_id']=='3'else 'melee','range':450 if m['damage_class_id']=='3'else 155,'description':mnames.get(mid,key)+' · '+('a distancia'if m['damage_class_id']=='3'else 'golpe cercano')}
   if power==0:rule['power']=60 # Fixed/reflected damage adapted to real-time combat.
  extra[key]={**rule,'visual':visuals.get(typ,'impact')}
 return key
existing={int(md[key]['id'])for i,kit in kits.items()if int(i)<=151 or int(i)==200 for key in kit}
for i in ids:
 if i<=151 or i==200:continue
 choices=legal[i];off=[m for m in choices if canonical[m]['damage_class_id']!='1'];utility=[m for m in choices if canonical[m]['damage_class_id']=='1']
 def score(mid):
  m=canonical[mid];return (types[m['type_id']]in data[i]['types'])*100+(mid in existing)*25+min(100,int(m['power']or 55))*.1+(int(m['damage_class_id'])==(3 if data[i]['base'][3]>data[i]['base'][1]else 2))*10
 off.sort(key=lambda m:(-score(m),m));utility.sort(key=lambda m:(m not in existing,m))
 if len(off)>=2 and utility:
  kits[str(i)]=[register(off[0]),register(off[1]),register(utility[(i//3)%min(4,len(utility))])]
 else:
  # Tiny canonical learnsets (Unown, Smeargle, Cosmog) get three combat modes
  # of their own move, rather than borrowing incompatible species techniques.
  mid=off[0]if off else sorted(choices)[0];base=register(mid);m=md[base];modes=[]
  for mode,label,rule in [('pulse','pulso',{'kind':'projectile','power':55}),('rush','avance',{'kind':'lunge','power':75,'range':155}),('guard','protección',{'kind':'self','power':0,'effect':'shield','duration':7})]:
   key=base+'-'+mode;md[key]={**m,'name':m['name']+' · '+label};extra[key]={**rule,'visual':visuals.get(m['type'],'impact'),'description':'Adaptación de '+m['name']+' para arena: '+label};modes.append(key)
  kits[str(i)]=modes
  print('ADAPTED SMALL LEARNSET',i,data[i]['name'],flush=True)
# Keep current authored rules when a new kit uses their keys. Only new keys need rules.
learnsets={i:[key for key,m in md.items()if m['id']in legal[i]]for i in ids}
for i,kit in kits.items():
 assert all(md[k]['id']in legal[int(i)]for k in kit),(i,kit)
writevars(ROOT/'species.js',{'SPECIES_DATA':data,'EVOLUTION_DATA':evos,'TYPE_CHART':chart})
writevars(ROOT/'moves.js',{'MOVE_DATA':md,'SPECIES_KITS':kits,'SPECIES_LEARNSETS':learnsets,'EXTRA_MOVE_RULES':extra})
writevars(ROOT/'field-moves.js',{'FIELD_MOVE_DATA':{k:{'id':byname[k],'name':mnames[byname[k]],'species':sorted(v)}for k,v in field.items()}})
(ROOT/'species-source.json').write_text(json.dumps({'source':BASE,'generations':9,'national':ids,'kanto':list(range(1,152)),'legacy':[200],'evolutions':evos},indent=2))
(ROOT/'moves-source.json').write_text(json.dumps({'source':BASE,'compatibility':'Canonical learnsets across version groups plus inherited earlier-form moves. Real-time mechanics adapted.','kits':kits,'moves':md,'learnsets':learnsets},ensure_ascii=False))
(ROOT/'field-moves-source.json').write_text(json.dumps({'source':BASE,'version_group':'all canonical generation version groups','moves':{k:sorted(v)for k,v in field.items()}},indent=2))
print('DATA READY:',len(data),'species;',len(kits),'legal kits;',len(extra),'additional move rules',flush=True)
# For expanded species, native game sprites with motion added by canvas rendering.
sprites=readvar(ROOT/'sprites.js','SPRITES');credit=json.loads((ROOT/'credits.json').read_text());ANIMS=['Idle','Walk','Attack','Shoot','Hurt','Sleep']
def sprite(i):
 if str(i)in sprites:return str(i),sprites[str(i)]
 dest=ROOT/'national'/f'{i}.png';dest.parent.mkdir(exist_ok=True)
 url=f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{int(pokemon[i]["id"])}.png'
 if not dest.exists():
  try:raw=fetch(url)
  except Exception:
   url=f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{i}.png';raw=fetch(url)
  im=Image.open(io.BytesIO(raw)).convert('RGBA');box=im.getbbox()
  if not box:raise ValueError(('Empty sprite',i))
  im=im.crop(box);ratio=min(42/im.width,44/im.height);im=im.resize((max(1,round(im.width*ratio)),max(1,round(im.height*ratio))),Image.Resampling.NEAREST)
  canvas=Image.new('RGBA',(64,64));canvas.alpha_composite(im,((64-im.width)//2,52-im.height));canvas.save(dest)
 box=Image.open(dest).getbbox();a={'file':f'assets/national/{i}.png','w':64,'h':64,'rows':1,'durations':[.6],'anchors':[[[32,52]]],'bounds':[[list(box)]],'proceduralMotion':True}
 return str(i),{'animations':{k:a for k in ANIMS},'credit':'Pokémon game sprite, distributed by PokéAPI/sprites. Canvas motion is original to this fangame.','source':url}
with concurrent.futures.ThreadPoolExecutor(max_workers=16)as pool:
 for n,(i,v)in enumerate(pool.map(sprite,ids),1):
  sprites[i]=v;credit.setdefault(i,{'credit':v['credit'],'source':v['source']})
  if n%100==0:print('SPRITES',n,'/',len(ids),flush=True)
writevars(ROOT/'sprites.js',{'SPRITES':sprites});(ROOT/'credits.json').write_text(json.dumps(credit,ensure_ascii=False,indent=2))
print('DONE:',len(data),'species and local sprite kits.',flush=True)
