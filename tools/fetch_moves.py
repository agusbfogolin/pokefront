"""Cache canonical move names/types and verify selected species compatibility."""
import concurrent.futures,csv,io,json,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'dist'/'assets'
BASE='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
KITS={1:['vine-whip','razor-leaf','leech-seed'],2:['razor-leaf','sludge-bomb','poison-powder'],3:['razor-leaf','solar-beam','sleep-powder'],4:['ember','scratch','smokescreen'],5:['flamethrower','dragon-rage','smokescreen'],6:['flamethrower','air-slash','will-o-wisp'],7:['water-gun','tackle','withdraw'],8:['water-pulse','bite','withdraw'],9:['hydro-pump','flash-cannon','iron-defense'],19:['quick-attack','bite','tail-whip'],23:['poison-sting','bite','glare'],25:['thunder-shock','quick-attack','thunder-wave'],26:['thunderbolt','iron-tail','agility'],37:['ember','quick-attack','confuse-ray'],43:['absorb','acid','stun-spore'],52:['scratch','pay-day','screech'],54:['water-gun','confusion','disable'],56:['karate-chop','fury-swipes','focus-energy'],58:['ember','bite','roar'],60:['bubble','water-gun','hypnosis'],66:['karate-chop','low-kick','focus-energy'],67:['karate-chop','cross-chop','bulk-up'],69:['vine-whip','acid','poison-powder'],74:['rock-throw','tackle','defense-curl'],75:['rock-slide','bulldoze','defense-curl'],81:['thunder-shock','magnet-bomb','thunder-wave'],92:['lick','shadow-ball','hypnosis'],93:['shadow-ball','dream-eater','hypnosis'],95:['rock-throw','rock-tomb','screech'],100:['spark','rollout','charge'],133:['quick-attack','bite','sand-attack'],200:['astonish','psybeam','confuse-ray']}

# Families keep characteristic tools; every selected move is checked against its learnset.
def family(ids,kit):
    for i in ids:
        if i not in KITS:KITS[i]=kit.split()
family([10], 'tackle bug-bite string-shot')
family([11], 'bug-bite electroweb harden')
family([12], 'gust psybeam sleep-powder')
family([13], 'poison-sting bug-bite string-shot')
family([14], 'poison-sting bug-bite harden')
family([15], 'twineedle poison-jab agility')
family([16,17,18], 'gust quick-attack sand-attack')
family([20], 'quick-attack hyper-fang focus-energy')
family([21,22], 'peck drill-peck leer')
family([24], 'poison-jab bite glare')
family([27,28], 'scratch bulldoze sand-attack')
family([29,30], 'poison-sting bite growl')
family([31], 'poison-jab earth-power toxic')
family([32,33], 'poison-sting double-kick leer')
family([34], 'poison-jab earth-power toxic')
family([35,36], 'disarming-voice moonblast sing')
family([38], 'flamethrower fire-blast confuse-ray')
family([39,40], 'disarming-voice body-slam sing')
family([41,42], 'wing-attack bite confuse-ray')
family([44,45], 'acid razor-leaf sleep-powder')
family([46,47], 'bug-bite absorb spore')
family([48,49], 'bug-bite psybeam stun-spore')
family([50,51], 'bulldoze scratch sand-attack')
family([53], 'pay-day bite screech')
family([55], 'water-pulse confusion disable')
family([57], 'low-kick cross-chop focus-energy')
family([59], 'flamethrower bite roar')
family([61], 'bubble water-pulse hypnosis')
family([62], 'water-pulse low-kick bulk-up')
family([63], 'confusion psychic reflect')
family([64,65], 'confusion psybeam reflect')
family([68], 'low-kick cross-chop bulk-up')
family([70,71], 'razor-leaf acid sleep-powder')
family([72,73], 'water-pulse acid barrier')
family([76], 'rock-slide bulldoze defense-curl')
family([77,78], 'ember stomp agility')
family([79,80], 'water-gun confusion slack-off')
family([82], 'thunderbolt magnet-bomb thunder-wave')
family([83], 'air-slash slash swords-dance')
family([84,85], 'peck drill-peck agility')
family([86,87], 'water-gun ice-beam aqua-ring')
family([88,89], 'sludge-bomb pound minimize')
family([90,91], 'water-gun icicle-spear withdraw')
family([94], 'shadow-ball dream-eater hypnosis')
family([96,97], 'confusion psybeam hypnosis')
family([98,99], 'bubble metal-claw swords-dance')
family([101], 'spark rollout charge')
family([102,103], 'confusion absorb leech-seed')
family([104,105], 'bone-club bonemerang focus-energy')
family([106], 'low-kick double-kick focus-energy')
family([107], 'mach-punch ice-punch agility')
family([108], 'lick stomp screech')
family([109,110], 'sludge-bomb flamethrower smokescreen')
family([111,112], 'rock-throw bulldoze leer')
family([113], 'pound dazzling-gleam soft-boiled')
family([114], 'vine-whip absorb stun-spore')
family([115], 'bite body-slam leer')
family([116,117], 'water-gun dragon-breath smokescreen')
family([118,119], 'water-pulse peck agility')
family([120,121], 'water-gun psybeam recover')
family([122], 'confusion dazzling-gleam barrier')
family([123], 'quick-attack wing-attack swords-dance')
family([124], 'powder-snow confusion lovely-kiss')
family([125], 'thunder-shock low-kick thunder-wave')
family([126], 'ember fire-punch smokescreen')
family([127], 'bug-bite vice-grip swords-dance')
family([128], 'horn-attack body-slam work-up')
family([129], 'tackle flail splash')
family([130], 'waterfall dragon-rage dragon-dance')
family([131], 'water-gun ice-beam sing')
family([132], 'transform transform transform')
family([134], 'water-gun aurora-beam aqua-ring')
family([135], 'thunder-shock pin-missile agility')
family([136], 'ember bite focus-energy')
family([137], 'psybeam tri-attack recover')
family([138,139], 'water-gun rock-throw withdraw')
family([140], 'aqua-jet absorb harden')
family([141], 'aqua-jet absorb swords-dance')
family([142], 'rock-slide wing-attack agility')
family([143], 'body-slam bite amnesia')
family([144], 'ice-beam gust mist')
family([145], 'thunderbolt drill-peck agility')
family([146], 'flamethrower wing-attack will-o-wisp')
family([147,148], 'dragon-breath wrap thunder-wave')
family([149], 'dragon-breath wing-attack dragon-dance')
family([150], 'confusion psystrike recover')
family([151], 'psybeam ancient-power reflect')
assert set(range(1,152)).issubset(KITS)

def get(name):
    cache=Path('/tmp/pokemon-frontera-csv')/name
    cache.parent.mkdir(exist_ok=True)
    if not cache.exists():cache.write_bytes(urllib.request.urlopen(BASE+name,timeout=120).read())
    text=cache.read_text()
    return name,list(csv.DictReader(io.StringIO(text)))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    tables=dict(pool.map(get,['moves.csv','move_names.csv','types.csv','pokemon_moves.csv']))
by_name={m['identifier']:m for m in tables['moves.csv']};names={m['move_id']:m['name'] for m in tables['move_names.csv'] if m['local_language_id']=='7'};types={t['id']:t['identifier'] for t in tables['types.csv']}
learn={}
for row in tables['pokemon_moves.csv']:
    i=int(row['pokemon_id'])
    if i in KITS:learn.setdefault(i,set()).add(row['move_id'])
# Evolved forms retain moves learned by their earlier forms.
evolution=json.loads((ROOT/'species-source.json').read_text())['evolutions']
for parent,options in evolution.items():
    for option in options:learn[option['target']].update(learn[int(parent)])
missing=[(i,name) for i,kit in KITS.items() for name in kit if by_name[name]['id'] not in learn[i]]
if missing:raise ValueError('Incompatible moves: '+str(missing))
data={}
for i,kit in KITS.items():
    for name in kit:
        m=by_name[name]
        if m['id'] not in learn[i]:raise ValueError(f'{i} cannot learn {name}')
        data[name]={'id':int(m['id']),'name':names[m['id']],'type':types[m['type_id']],'power':int(m['power'] or 0),'special':m['damage_class_id']=='3'}
learnsets={i:[key for key,m in data.items() if str(m['id']) in learn[i]] for i in KITS}
(ROOT/'moves.js').write_text('window.MOVE_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nwindow.SPECIES_KITS='+json.dumps(KITS,separators=(',',':'))+';\nwindow.SPECIES_LEARNSETS='+json.dumps(learnsets,separators=(',',':'))+';')
(ROOT/'moves-source.json').write_text(json.dumps({'source':BASE,'compatibility':'At least one version group in pokemon_moves.csv, including inherited earlier-form moves; realtime rules are adapted.','kits':KITS,'moves':data,'learnsets':learnsets},ensure_ascii=False,indent=2))
print('Verified',len(KITS),'species kits and',len(data),'canonical moves.')
