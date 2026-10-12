"""Import PokéAPI's complete move table without discarding saved move keys.

Run AFTER fetch_generations.py: that older generator deliberately builds a small
three-move starter catalog. This importer upgrades it to complete legal learning
lists and four equipped moves, retaining the authored arena rules and aliases.
"""
import concurrent.futures
import csv
import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'assets'
CACHE = Path('/tmp/frontera-national-csv')
BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
GMAX_SOURCE = 'https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/moves.ts'
FILES = ['moves.csv', 'move_names.csv', 'move_meta.csv',
         'move_meta_stat_changes.csv', 'move_meta_categories.csv',
         'move_meta_ailments.csv', 'stats.csv', 'move_targets.csv',
         'types.csv', 'pokemon.csv', 'pokemon_species.csv', 'pokemon_moves.csv']


def table(name):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        for attempt in range(3):
            try:
                raw = urllib.request.urlopen(BASE + name, timeout=180).read()
                path.write_bytes(raw)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(.3)
    with path.open() as source:
        return list(csv.DictReader(source))


def readvar(path, name):
    match = re.search(r'window\.' + name + r'=(.*?);(?:\n|$)', path.read_text())
    return json.loads(match.group(1)) if match else {}


def number(row, key, default=0):
    return int(row.get(key) or default)


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    tables = dict(zip(FILES, pool.map(table, FILES)))

canonical = {number(r, 'id'): r for r in tables['moves.csv']}
names = {number(r, 'move_id'): r['name'] for r in tables['move_names.csv']
         if r['local_language_id'] == '7'}
types = {r['id']: r['identifier'] for r in tables['types.csv']}
targets = {r['id']: r['identifier'] for r in tables['move_targets.csv']}
categories = {r['id']: r['identifier'] for r in tables['move_meta_categories.csv']}
ailments = {r['id']: r['identifier'] for r in tables['move_meta_ailments.csv']}
stats = {r['id']: r['identifier'] for r in tables['stats.csv']}
meta = {number(r, 'move_id'): r for r in tables['move_meta.csv']}
changes = {}
for row in tables['move_meta_stat_changes.csv']:
    changes.setdefault(number(row, 'move_id'), []).append({
        'stat': stats[row['stat_id']], 'change': number(row, 'change')})

movefile = ROOT / 'moves.js'
md = readvar(movefile, 'MOVE_DATA')
kits = readvar(movefile, 'SPECIES_KITS')
extra = readvar(movefile, 'EXTRA_MOVE_RULES')
data = readvar(ROOT / 'species.js', 'SPECIES_DATA')
evos = readvar(ROOT / 'species.js', 'EVOLUTION_DATA')
old_keys = set(md)
species = {number(r, 'id'): r for r in tables['pokemon_species.csv']
           if 1 <= number(r, 'generation_id') <= 9}
default = {number(r, 'id'): number(r, 'species_id')
           for r in tables['pokemon.csv']
           if r['is_default'] == '1' and number(r, 'species_id') in species}

VISUALS = {'fire': 'fire', 'water': 'water', 'grass': 'leaf',
           'electric': 'electric', 'ice': 'ice', 'psychic': 'psychic',
           'ghost': 'ghost', 'dark': 'bite', 'dragon': 'dragon',
           'steel': 'metal', 'ground': 'ground', 'rock': 'rock',
           'flying': 'wind', 'bug': 'needle', 'poison': 'sludge',
           'fairy': 'psychic', 'fighting': 'chop', 'normal': 'impact',
           'shadow': 'ghost', 'stellar': 'psychic', 'unknown': 'psychic'}
STATUS_EFFECTS = {'paralysis': 'paralysis', 'sleep': 'sleep',
                  'freeze': 'slow', 'burn': 'burn', 'poison': 'poison',
                  'confusion': 'confusion', 'infatuation': 'confusion',
                  'trap': 'slow', 'nightmare': 'seed', 'torment': 'disable',
                  'disable': 'disable', 'heal-block': 'disable',
                  'no-type-immunity': 'defDown', 'embargo': 'disable',
                  'perish-song': 'seed', 'ingrain': 'regen',
                  'silence': 'disable'}
STAT_LABELS = {'attack': 'ataque', 'defense': 'defensa',
               'special-attack': 'ataque especial',
               'special-defense': 'defensa especial', 'speed': 'velocidad',
               'accuracy': 'precisión', 'evasion': 'evasión'}
FIELD_WEATHER = {'rain-dance': 'rain', 'sunny-day': 'sun',
                 'sandstorm': 'sand', 'hail': 'hail', 'snowscape': 'snow',
                 'shadow-sky': 'shadow'}
FIELD_TERRAIN = {'electric-terrain': 'electric', 'grassy-terrain': 'grass',
                 'misty-terrain': 'fairy', 'psychic-terrain': 'psychic'}


def metadata(row):
    mid = number(row, 'id')
    m = meta.get(mid, {})
    damage_class = {'1': 'status', '2': 'physical', '3': 'special'}[row['damage_class_id']]
    drain = number(m, 'drain') / 100
    return {
        'id': mid, 'name': names.get(mid, row['identifier']),
        'type': types[row['type_id']], 'power': number(row, 'power'),
        'special': damage_class == 'special',
        'generation': number(row, 'generation_id'),
        'accuracy': number(row, 'accuracy') if row['accuracy'] else None,
        'pp': number(row, 'pp') if row['pp'] else None,
        'priority': number(row, 'priority'), 'damageClass': damage_class,
        'target': targets[row['target_id']],
        'effectId': number(row, 'effect_id') if row['effect_id'] else None,
        'effectChance': number(row, 'effect_chance') / 100,
        'category': categories.get(m.get('meta_category_id'),
                                   'unique' if damage_class == 'status' else 'damage'),
        'ailment': ailments.get(m.get('meta_ailment_id'), 'none'),
        'ailmentChance': number(m, 'ailment_chance') / 100,
        'drain': drain, 'healing': number(m, 'healing') / 100,
        'recoil': max(0, -drain), 'critRate': number(m, 'crit_rate'),
        'minHits': number(m, 'min_hits', 1),
        'maxHits': number(m, 'max_hits', 1),
        'flinchChance': number(m, 'flinch_chance') / 100,
        'statChance': number(m, 'stat_chance') / 100,
        'statChanges': changes.get(mid, []),
    }


def description(key, m):
    parts = []
    if m['damageClass'] != 'status':
        parts.append('Golpe físico' if m['damageClass'] == 'physical' else 'Ataque especial')
        if m['maxHits'] > 1:
            parts.append('varios impactos')
        if m['drain'] > 0:
            parts.append('absorbe vida')
        if m['recoil']:
            parts.append('causa retroceso al usuario')
    if m['healing']:
        parts.append('recupera vida')
    ailment = m['ailment']
    if ailment not in ('none', 'unknown'):
        parts.append({'poison': 'puede envenenar', 'burn': 'puede quemar',
                      'sleep': 'puede dormir', 'paralysis': 'puede paralizar',
                      'freeze': 'puede congelar', 'confusion': 'puede confundir',
                      'trap': 'puede inmovilizar'}.get(ailment, 'efecto de estado'))
    for change in m['statChanges']:
        parts.append(('sube ' if change['change'] > 0 else 'baja ') +
                     STAT_LABELS.get(change['stat'], change['stat']))
    if key in FIELD_WEATHER:
        parts.append('cambia el clima')
    if key in FIELD_TERRAIN:
        parts.append('cambia el terreno')
    if not parts:
        parts.append({'force-switch': 'desplaza al rival',
                      'ohko': 'ataque decisivo',
                      'whole-field-effect': 'afecta el campo',
                      'field-effect': 'prepara el campo',
                      'net-good-stats': 'técnica de preparación',
                      'heal': 'técnica de recuperación'}.get(m['category'],
                       'técnica de apoyo adaptada a la arena'))
    return ' · '.join(parts).capitalize()


def rule(key, m):
    status = m['damageClass'] == 'status'
    self_target = m['target'] in ('user', 'users-field', 'user-and-allies',
                                'all-allies', 'ally', 'user-or-ally', 'entire-field')
    r = {'kind': 'self' if status and self_target else
                  'projectile' if status or m['special'] else 'melee',
         'range': 450 if status or m['special'] else 155,
         'visual': VISUALS.get(m['type'], 'impact'),
         'description': description(key, m)}
    if status:
        r['power'] = 0
    elif not m['power']:
        # Canonical variable/fixed powers remain 0 in metadata; arena scaling
        # is an explicit rule, never a fabricated canonical power value.
        r['power'] = 65
        r['variablePower'] = True
    effect = STATUS_EFFECTS.get(m['ailment'])
    if effect:
        r.update(effect=effect, duration=2 if effect == 'sleep' else 7)
        r['chance'] = 1 if status else m['ailmentChance'] or m['effectChance'] or .2
    elif m['healing'] and status:
        r['kind'] = 'self'
    elif status and m['statChanges']:
        change = m['statChanges'][0]
        stat, amount = change['stat'], change['change']
        if amount > 0:
            r['effect'] = {'attack': 'physicalUp', 'special-attack': 'specialUp',
                           'defense': 'physicalDef', 'special-defense': 'specialDef',
                           'speed': 'haste', 'evasion': 'guard',
                           'accuracy': 'criticalFocus'}.get(stat, 'focus')
        else:
            r['effect'] = {'attack': 'attackDown', 'special-attack': 'attackDown',
                           'defense': 'defDown', 'special-defense': 'defDown',
                           'speed': 'slow', 'accuracy': 'blind',
                           'evasion': 'defDown'}.get(stat, 'attackDown')
        r['duration'] = 8
    elif status:
        # Bespoke field/utility cases expose their intention to the combat
        # engine; an unsupported utility has a modest arena support action.
        if key in FIELD_WEATHER:
            r.update(kind='self', weather=FIELD_WEATHER[key], duration=18)
        elif key in FIELD_TERRAIN:
            r.update(kind='self', terrain=FIELD_TERRAIN[key], duration=18)
        elif any(word in key for word in ['protect', 'guard', 'shield', 'veil', 'screen', 'safeguard', 'barrier']):
            r.update(kind='self', effect='shield', duration=7)
        elif any(word in key for word in ['spikes', 'stealth-rock', 'sticky-web']):
            r.update(kind='targetArea', areaRadius=110, hazard=key, duration=18)
        elif key in ('focus-energy', 'laser-focus'):
            r.update(kind='self', effect='criticalFocus', duration=8)
        elif m['category'] == 'force-switch':
            r.update(kind='cone', range=290, repel=130)
        else:
            r.update(effect='guard' if self_target else 'attackDown', duration=5)
    if m['drain'] > 0:
        r['drain'] = m['drain']
    return r


for mid, row in sorted(canonical.items()):
    key = row['identifier']
    m = metadata(row)
    m['description'] = description(key, m)
    md[key] = {**md.get(key, {}), **m}
    if key not in old_keys:
        extra[key] = rule(key, m)

# The nine old arena aliases retain their old names and rule powers. Metadata
# describes their canonical source; arenaVariant makes the distinction explicit.
for key, entry in list(md.items()):
    row = canonical.get(entry['id'])
    if row and key != row['identifier']:
        old_name = entry['name']
        md[key] = {**entry, **metadata(row), 'name': old_name,
                   'arenaVariant': True, 'canonicalKey': row['identifier'],
                   'description': 'Modo de arena de ' + names.get(entry['id'], row['identifier'])}

# PokéAPI does not enumerate Gigantamax techniques. Showdown's maintained
# primary battle data enumerates all 33; they are catalog variants, not false
# default-form learnset grants. Source names are English because neither of
# these primary data tables provides official Spanish G-Max translations.
gmax_path = CACHE / 'showdown-moves.ts'
if not gmax_path.exists():
    gmax_path.write_bytes(urllib.request.urlopen(GMAX_SOURCE, timeout=180).read())
gmax_blocks = re.findall(r'\n\t(gmax\w+): \{(.*?)\n\t\},', gmax_path.read_text(), re.S)
assert len(gmax_blocks) == 33, ('Unexpected Gigantamax catalog', len(gmax_blocks))
max_by_type = {m['type']: key for key, m in md.items()
               if key.startswith('max-') and key != 'max-guard'}
for position, (slug, block) in enumerate(sorted(gmax_blocks), 20001):
    def field(name, default=None):
        match = re.search(r'\n\t\t' + name + r': ("[^"]*"|true|false|-?\d+),', block)
        return json.loads(match.group(1)) if match else default

    name = field('name')
    key = 'gmax-' + re.sub(r'[^a-z0-9]+', '-', name.lower().removeprefix('g-max ')).strip('-')
    typ = field('type', 'Normal').lower()
    damage_class = field('category', 'Physical').lower()
    m = {'id': position, 'name': name, 'type': typ,
         'power': field('basePower', 0), 'special': damage_class == 'special',
         'generation': 8, 'accuracy': None, 'pp': field('pp'),
         'priority': field('priority', 0), 'damageClass': damage_class,
         'target': 'selected-pokemon', 'effectId': None,
         'effectChance': 0, 'category': 'damage', 'ailment': 'none',
         'ailmentChance': 0, 'drain': 0, 'healing': 0, 'recoil': 0,
         'critRate': 0, 'minHits': 1, 'maxHits': 1,
         'flinchChance': 0, 'statChance': 0, 'statChanges': [],
         'specialSystem': 'gigantamax', 'canonical': False,
         'variantOf': max_by_type.get(typ), 'nameLanguage': 'en',
         'variableDamageClass': True, 'showdownKey': slug,
         'description': 'Técnica Gigamax · potencia y categoría dependen del movimiento base'}
    md[key] = m
    if key not in extra:
        extra[key] = {**rule(key, m), 'variablePower': True,
                      'description': m['description']}

legal = {i: set() for i in species}
levels = {i: {} for i in species}
for row in tables['pokemon_moves.csv']:
    sid = default.get(number(row, 'pokemon_id'))
    mid = number(row, 'move_id')
    if sid is None or mid not in canonical:
        continue
    legal[sid].add(mid)
    level = max(1, number(row, 'level')) if row['pokemon_move_method_id'] == '1' else 15
    levels[sid][mid] = min(levels[sid].get(mid, 100), level)

# Complete chains include cross-generation evolutions and baby species.
for _ in range(10):
    modified = False
    for sid, row in species.items():
        parent = number(row, 'evolves_from_species_id')
        if parent not in legal:
            continue
        before = len(legal[sid])
        legal[sid].update(legal[parent])
        modified |= len(legal[sid]) != before
        for mid, level in levels[parent].items():
            levels[sid][mid] = min(levels[sid].get(mid, 100), level)
    if not modified:
        break

learnsets = {}
move_levels = {}
ultimates = {}
all_legal = set().union(*legal.values())
for sid in sorted(species):
    native_types = data[str(sid)]['types']
    native_stats = data[str(sid)]['base']
    prefer_special = native_stats[3] > native_stats[1]
    compatible = [key for key, move in md.items() if move['id'] in legal[sid]]
    assert compatible, ('No canonical learnset', sid)

    def score(key):
        move = md[key]
        return ((move['type'] in native_types) * 70 +
                (move['damageClass'] != 'status') * 60 +
                (move['special'] == prefer_special) * 12 +
                min(move['power'], 160) / 3 -
                (key == 'self-destruct' or key == 'explosion') * 120 -
                (key == 'struggle') * 100 -
                bool(move.get('arenaVariant')) * 8)

    ordered = sorted(compatible, key=lambda key: (-score(key), md[key]['id'], key))
    kit = kits[str(sid)][:4]
    assert all(key in compatible for key in kit), (sid, 'Illegal preserved kit', kit)
    for key in ordered:
        if len(kit) == 4:
            break
        if key not in kit:
            kit.append(key)
    while len(kit) < 4:
        # Ditto, for example, canonically knows only Transform. Repeated
        # buttons do not grant another species' move or imaginary damage.
        kit.append(kit[len(kit) % len(kit)])
    kits[str(sid)] = kit
    learnsets[str(sid)] = compatible
    move_levels[str(sid)] = {key: levels[sid].get(md[key]['id'], 15)
                             for key in compatible}
    if not evos.get(str(sid)):
        ultimates[str(sid)] = ordered

for key, move in md.items():
    move['catalogOnly'] = move['id'] not in all_legal
    mid = move['id']
    if 10001 <= mid <= 10018:
        move['specialSystem'] = 'shadow'
    elif key.startswith('max-'):
        move['specialSystem'] = 'dynamax'
    elif 622 <= mid <= 658 or mid in {695, 696, 697, 698, 699, 700, 701, 702, 703, 719, 723, 724, 725, 726, 727, 728}:
        move['specialSystem'] = 'z'

values = {'MOVE_DATA': md, 'SPECIES_KITS': kits,
          'SPECIES_LEARNSETS': learnsets, 'EXTRA_MOVE_RULES': extra,
          'SPECIES_MOVE_LEVELS': move_levels, 'SPECIES_ULTIMATES': ultimates}
movefile.write_text('\n'.join('window.' + name + '=' +
                           json.dumps(value, ensure_ascii=False, separators=(',', ':')) + ';'
                           for name, value in values.items()) + '\n')
source = {
    'source': BASE,
    'tables': FILES,
    'canonicalMoveCount': len(canonical),
    'mainSeriesMoveCount': sum(mid < 10000 for mid in canonical),
    'shadowMoveCount': sum(mid >= 10000 for mid in canonical),
    'arenaVariantCount': sum(bool(m.get('arenaVariant')) for m in md.values()),
    'gigantamaxVariantCount': len(gmax_blocks),
    'gigantamaxSource': GMAX_SOURCE,
    'catalogOnlyCount': sum(m['catalogOnly'] and not m.get('arenaVariant') for m in md.values()),
    'specialSystems': {system: sum(m.get('specialSystem') == system for m in md.values())
                       for system in ('z', 'dynamax', 'gigantamax', 'shadow')},
    'compatibility': 'Default-form canonical learnsets, union across all version groups, plus ancestral evolutionary forms. No type-based illegal move grants.',
    'levelPolicy': 'Minimum canonical level-up level across versions; machine/tutor/egg/event techniques use level 15. Prior forms are inherited.',
    'arenaPolicy': 'Canonical metadata retained. Authored real-time rules and nine legacy variants are retained; variable powers and field utilities have explicit arena adaptations.',
    'coverageLimit': 'Z, Dynamax, Gigantamax and shadow moves are cataloged; special-form/battle systems are not canonical default-form learned techniques. The 33 G-Max entries come from Showdown, use separate synthetic IDs and retain source English names.',
    'kits': kits, 'moves': md, 'learnsets': learnsets,
    'levels': move_levels, 'ultimates': ultimates,
}
(ROOT / 'moves-source.json').write_text(json.dumps(source, ensure_ascii=False, separators=(',', ':')) + '\n')
print(json.dumps({key: source[key] for key in ['canonicalMoveCount', 'mainSeriesMoveCount',
      'shadowMoveCount', 'arenaVariantCount', 'catalogOnlyCount', 'specialSystems']}, indent=2))
print('READY:', len(kits), 'four-move kits;', len(ultimates), 'terminal-species ultimate catalogs')
