"""Extract FireRed/LeafGreen field-move compatibility from the PokéAPI CSVs."""
from pathlib import Path
import csv, json, os, urllib.request
ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'assets'
CACHE = Path(os.environ.get('FIELD_CSV_CACHE', '/tmp/pokemon-frontera-field-csv'))
BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
KEYS = ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall', 'dig', 'teleport']
def rows(name):
    CACHE.mkdir(parents=True, exist_ok=True)
    file = CACHE / name
    if not file.exists(): file.write_bytes(urllib.request.urlopen(BASE + name, timeout=45).read())
    with file.open() as source: return list(csv.DictReader(source))
moves = {m['identifier']:m for m in rows('moves.csv')}
names = {m['move_id']:m['name'] for m in rows('move_names.csv') if m['local_language_id'] == '7'}
ids = {moves[key]['id']:key for key in KEYS}
legal = {key:set() for key in KEYS}
for row in rows('pokemon_moves.csv'):
    pokemon = int(row['pokemon_id'])
    if row['version_group_id'] == '7' and row['move_id'] in ids and (1 <= pokemon <= 151 or pokemon == 200):
        legal[ids[row['move_id']]].add(pokemon)
data = {key:{'id':int(moves[key]['id']), 'name':names[moves[key]['id']], 'species':sorted(legal[key])} for key in KEYS}
assert all(value['species'] for value in data.values())
(ROOT / 'field-moves.js').write_text('window.FIELD_MOVE_DATA=' + json.dumps(data, ensure_ascii=False, separators=(',',':')) + ';\n')
(ROOT / 'field-moves-source.json').write_text(json.dumps({'dataset':'PokéAPI pokemon_moves.csv', 'version_group':'firered-leafgreen (7)', 'source':BASE, 'moves':data, 'mechanics_references':['https://diamondpearl.pokemon.com/en-ca/trainersguide/fundamentals/sinnoh/','https://pkproject.net/juegos/manual/manual-NDS-Pokemon-Diamante-EN.pdf'], 'adaptation':'Compatible party members use field techniques after their regional badge, without occupying the three battle slots.'}, ensure_ascii=False, indent=2) + '\n')
for key, value in data.items(): print(key, value['name'], len(value['species']), 'compatible species')
