"""Cache all Kanto species and their evolution paths from PokéAPI."""
import urllib.request,csv,io,json,concurrent.futures
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]/'dist'/'assets'
IDS=list(range(1,152))+[200]
BASE='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
def get(name):
    return name,list(csv.DictReader(io.StringIO(urllib.request.urlopen(BASE+name,timeout=60).read().decode())))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as p:
    tables=dict(p.map(get,['pokemon.csv','pokemon_stats.csv','pokemon_types.csv','types.csv','pokemon_species.csv','pokemon_species_names.csv','pokemon_evolution.csv','type_efficacy.csv']))
types={r['id']:r['identifier'] for r in tables['types.csv']}
names={r['pokemon_species_id']:r['name'] for r in tables['pokemon_species_names.csv'] if r['local_language_id']=='7'}
species={int(r['id']):r for r in tables['pokemon_species.csv']}
data={};evolutions={}
for i in IDS:
    p=next(r for r in tables['pokemon.csv'] if r['id']==str(i))
    s=sorted([r for r in tables['pokemon_stats.csv'] if r['pokemon_id']==str(i)],key=lambda r:int(r['stat_id']))
    t=sorted([r for r in tables['pokemon_types.csv'] if r['pokemon_id']==str(i)],key=lambda r:int(r['slot']))
    data[str(i)]={'id':i,'name':names.get(str(i),p['identifier'].capitalize()),'base':[int(r['base_stat']) for r in s],'types':[types[r['type_id']] for r in t],'baseExp':int(p['base_experience']),'height':int(p['height']),'rare':species[i]['is_legendary']=='1' or species[i]['is_mythical']=='1'}
for row in tables['pokemon_evolution.csv']:
    target=int(row['evolved_species_id'])
    if target>151:continue
    parent=species[target]['evolves_from_species_id']
    if not parent or int(parent)>151:continue
    trigger=int(row['evolution_trigger_id'])
    cost=3 if trigger!=1 else 0
    option={'target':target,'level':int(row['minimum_level'] or 1),'cost':cost,'method':'fragmentos' if cost else 'nivel'}
    bucket=evolutions.setdefault(parent,[])
    if not any(v['target']==target for v in bucket):bucket.append(option)
chart={}
for r in tables['type_efficacy.csv']:
    if int(r['damage_factor'])!=100:chart.setdefault(types[r['damage_type_id']],{})[types[r['target_type_id']]]=int(r['damage_factor'])/100
(ROOT/'species.js').write_text('window.SPECIES_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nwindow.EVOLUTION_DATA='+json.dumps(evolutions,separators=(',',':'))+';\nwindow.TYPE_CHART='+json.dumps(chart,separators=(',',':'))+';')
(ROOT/'species-source.json').write_text(json.dumps({'source':BASE,'kanto':list(range(1,152)),'legacy':[200],'evolutions':evolutions},indent=2))
print('Cached',len(data),'species and',sum(map(len,evolutions.values())),'Kanto evolution paths')
