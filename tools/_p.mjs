import fs from 'node:fs';import vm from 'node:vm';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),r={window:{}};
for(const f of ['items','moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);
const c={};for(const m of Object.values(F.MAPS)){if(m.kind==='town'||m.kind==='gym')continue;const k=m.region+'|'+(m.biome||F.REGIONS[m.region].biome)+'|'+(F.districtBase?.(m.region)||m.region)+'|'+m.kind;c[k]=(c[k]||0)+1}console.log(c)
