"""Cache canonical Pokémon item IDs, Spanish names and original inventory sprites."""
import concurrent.futures,csv,io,json,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'dist'/'assets'
BASE='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
SLUGS='poke-ball great-ball ultra-ball master-ball potion super-potion hyper-potion max-potion full-restore antidote paralyze-heal awakening burn-heal ice-heal full-heal revive max-revive ether max-ether elixir max-elixir oran-berry sitrus-berry lum-berry pecha-berry cheri-berry chesto-berry rawst-berry aspear-berry leppa-berry repel super-repel max-repel escape-rope rare-candy pp-up pp-max hp-up protein iron calcium zinc carbos fire-stone water-stone thunder-stone leaf-stone moon-stone linking-cord charcoal mystic-water magnet miracle-seed silk-scarf sharp-beak hard-stone poison-barb silver-powder twisted-spoon spell-tag never-melt-ice dragon-fang black-belt leftovers shell-bell quick-claw x-attack x-defense x-sp-atk x-sp-def x-speed dire-hit guard-spec nugget pearl big-pearl stardust star-piece town-map bicycle old-rod good-rod super-rod'.split()
def rows(name):
 cache=Path('/tmp/frontera-'+name)
 if not cache.exists():cache.write_bytes(urllib.request.urlopen(BASE+name,timeout=30).read())
 return list(csv.DictReader(io.StringIO(cache.read_text())))
items={row['identifier']:row for row in rows('items.csv')};names={row['item_id']:row['name'] for row in rows('item_names.csv') if row['local_language_id']=='7'}
missing=[s for s in SLUGS if s not in items]
assert not missing,missing
out={s:{'id':int(items[s]['id']),'name':names.get(items[s]['id'],s),'sourceCost':int(items[s]['cost'] or 0),'sprite':'assets/items/'+s+'.png'} for s in SLUGS}
(ROOT/'items').mkdir(exist_ok=True)
def sprite(slug):
 p=ROOT/'items'/(slug+'.png')
 if not p.exists():
        try:p.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/'+slug+'.png',timeout=30).read())
        except urllib.error.HTTPError as e:
            if e.code!=404:raise
            fallback=ROOT/'items'/(slug+'.svg')
            fallback.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#597c88" stroke-width="4"><rect x="3" y="8" width="10" height="16" rx="5"/><rect x="19" y="8" width="10" height="16" rx="5"/><path d="M10 16h12"/></g></svg>')
            out[slug]['sprite']='assets/items/'+slug+'.svg';out[slug]['spriteCredit']='Original code-drawn fallback; source sprite unavailable.'
 return slug
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(sprite,SLUGS))
(ROOT/'items.js').write_text('window.ITEM_DATA='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'items-source.json').write_text(json.dumps({'source':'https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv','sprites':'https://github.com/PokeAPI/sprites/tree/master/sprites/items','items':out},ensure_ascii=False,indent=2))
print('Verified',len(out),'canonical items with names and local sprites.')
