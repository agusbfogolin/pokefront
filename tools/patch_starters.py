import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
a="icon(b,id,72);const info"
assert s.count(a)==1 or 'starterArt(b,id)' in s
if 'function starterArt' not in s:
    fn="function starterArt(b,id){if(typeof Image!=='function')return;const im=new Image();im.className='starterart';im.alt=F.DATA[id].name;im.decoding='async';im.onload=()=>{const c=b.querySelector('canvas');if(c)c.remove();b.prepend(im)};im.src='assets/starters/'+id+'.png'}"
    s=s.replace("function renderStarters(){",fn+"function renderStarters(){",1)
    s=s.replace(a,"icon(b,id,72);starterArt(b,id);const info",1)
open(p,'w',encoding='utf-8').write(s)
print('ok',p)
