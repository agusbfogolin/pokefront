// Adds Headbutt (Golpe Cabeza) to dist/assets/field-moves.js using the learnsets already shipped with the game,
// so no network access is needed. Re-run after regenerating field-moves.js with fetch_field_moves.py.
import fs from 'node:fs';import vm from 'node:vm';
const root={window:{}};for(const name of['moves','species','field-moves'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+name+'.js',import.meta.url),'utf8'),root);
const w=root.window,species=Object.entries(w.SPECIES_LEARNSETS).filter(([,moves])=>moves.includes('headbutt')).map(([id])=>Number(id)).sort((a,b)=>a-b);
if(!species.length)throw Error('No Headbutt learners found');
const data={...w.FIELD_MOVE_DATA,headbutt:{id:w.MOVE_DATA.headbutt.id,name:w.MOVE_DATA.headbutt.name,species}};
fs.writeFileSync(new URL('../dist/assets/field-moves.js',import.meta.url),'window.FIELD_MOVE_DATA='+JSON.stringify(data)+';\n');
const sourceUrl=new URL('../dist/assets/field-moves-source.json',import.meta.url),source=JSON.parse(fs.readFileSync(sourceUrl,'utf8'));
source.moves.headbutt=species;source.derived={headbutt:'Species whose shipped learnset contains Headbutt (SPECIES_LEARNSETS).'};
fs.writeFileSync(sourceUrl,JSON.stringify(source,null,1)+'\n');
console.log('headbutt',species.length,'compatible species');
