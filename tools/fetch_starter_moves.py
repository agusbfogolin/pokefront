"""Pin starter families to their debut games' level-up moves (PokéAPI).

Run after fetch_generations.py and fetch_all_moves.py. The complete compatibility
catalog stays available; it is not an initial moveset. Downloaded CSVs are cached.
"""
import argparse
import csv
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
parser = argparse.ArgumentParser()
parser.add_argument('--cache', type=Path, default=Path('/tmp/frontera-starter-data'))
cache = parser.parse_args().cache
cache.mkdir(parents=True, exist_ok=True)

def table(name):
    path = cache / name
    if not path.exists():
        path.write_bytes(urllib.request.urlopen(BASE + name, timeout=120).read())
    with path.open() as source:
        return list(csv.DictReader(source))

def readvar(text, name):
    return json.loads(re.search(r'window\.' + name + r'=(.*?);(?:\n|$)', text).group(1))

path = ROOT / 'dist/assets/species.js'
text = path.read_text()
data = readvar(text, 'SPECIES_DATA')
moves = {int(row['id']): row['identifier'] for row in table('moves.csv')}
versions = {int(row['id']): row['identifier'] for row in table('version_groups.csv')}
move_data = readvar((ROOT / 'dist/assets/moves.js').read_text(), 'MOVE_DATA')
# Original paired games, with Yellow for the additional Pikachu starter.
groups = [(1, [1, 4, 7]), (3, [152, 155, 158]), (5, [252, 255, 258]),
          (8, [387, 390, 393]), (11, [495, 498, 501]),
          (15, [650, 653, 656]), (17, [722, 725, 728]),
          (20, [810, 813, 816]), (25, [906, 909, 912])]
species_versions = {first + stage: version for version, starters in groups
                    for first in starters for stage in range(3)}
species_versions.update({25: 2, 26: 2, 172: 3})
profiles = {sid: [] for sid in species_versions}
for row in table('pokemon_moves.csv'):
    sid = int(row['pokemon_id'])
    if (sid not in species_versions or row['pokemon_move_method_id'] != '1'
            or int(row['version_group_id']) != species_versions[sid]):
        continue
    key = moves[int(row['move_id'])]
    assert key in move_data, (sid, key)
    profiles[sid].append((max(1, int(row['level'])), int(row['order'] or 0),
                          int(row['move_id']), key))

for sid, profile in profiles.items():
    assert profile, ('Missing level-up profile', sid)
    entries, seen = [], set()
    for level, order, mid, key in sorted(profile):
        if key not in seen:
            seen.add(key)
            entries.append([level, key])
    data[str(sid)]['levelUpMoves'] = entries
    data[str(sid)]['moveVersion'] = versions[species_versions[sid]]

text = re.sub(r'window\.SPECIES_DATA=.*?;(?:\n|$)',
              lambda match: 'window.SPECIES_DATA=' + json.dumps(
                  data, ensure_ascii=False, separators=(',', ':')) + ';\n', text)
path.write_text(text)
print('READY:', len(profiles), 'starter-family level-up profiles')
for version, starters in groups:
    for sid in starters:
        print(data[str(sid)]['name'], [key for level, key in data[str(sid)]['levelUpMoves'] if level <= 5])
