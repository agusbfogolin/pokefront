import concurrent.futures, json, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]/'dist'
BASE='https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/'
IDS=list(range(1,152))+[200] # Keep Misdreavus for existing saves.
ANIMS=['Idle','Walk','Attack','Shoot','Hurt','Sleep']

def fetch(url,path):
    if not path.exists():
        for attempt in range(3):
            try:
                data=urllib.request.urlopen(url,timeout=35).read()
                path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data);break
            except Exception:
                if attempt==2:raise
    return path

def species(num):
    dest=ROOT/'assets'/str(num); remote=BASE+f'sprite/{num:04d}/'
    xml=fetch(remote+'AnimData.xml',dest/'AnimData.xml')
    credit=fetch(remote+'credits.txt',dest/'credits.txt').read_text()
    defs={a.findtext('Name'):a for a in ET.parse(xml).getroot().find('Anims')}
    result={}
    for requested in ANIMS:
        name=requested if requested in defs else 'Idle'
        node=defs[name]
        while node.find('CopyOf') is not None:
            name=node.findtext('CopyOf');node=defs[name]
        w=int(node.findtext('FrameWidth'));h=int(node.findtext('FrameHeight'))
        image=fetch(remote+name+'-Anim.png',dest/(name+'-Anim.png'))
        shadows=fetch(remote+name+'-Shadow.png',dest/(name+'-Shadow.png'))
        im=Image.open(image).convert('RGBA');shadow=Image.open(shadows).convert('RGBA')
        durations=[int(d.text)/60 for d in node.find('Durations')]
        anchors=[];bounds=[]
        for row in range(im.height//h):
            points=[];row_bounds=[]
            for col in range(im.width//w):
                box=(col*w,row*h,(col+1)*w,(row+1)*h)
                frame=shadow.crop(box)
                row_bounds.append(im.crop(box).getbbox())
                white=[(x,y) for y in range(h) for x in range(w) if frame.getpixel((x,y))==(255,255,255,255)]
                points.append(list(white[0]) if white else [w//2,h//2+8])
            anchors.append(points);bounds.append(row_bounds)
        result[requested]={'file':f'assets/{num}/{name}-Anim.png','w':w,'h':h,'rows':im.height//h,'durations':durations,'anchors':anchors,'bounds':bounds}
    print(f'{num:03d}: '+', '.join(result),flush=True)
    return str(num),{'animations':result,'credit':credit,'source':f'https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/{num:04d}'}

with concurrent.futures.ThreadPoolExecutor(max_workers=12) as p:
    data=dict(p.map(species,IDS))
fetch(BASE+'LICENSE.md',ROOT/'assets'/'SPRITECOLLAB_LICENSE.md')
fetch(BASE+'credit_names.txt',ROOT/'assets'/'credit_names.txt')
(ROOT/'assets'/'sprites.js').write_text('window.SPRITES='+json.dumps(data,separators=(',',':'))+';')
(ROOT/'assets'/'sprites_manifest.json').write_text(json.dumps(data,indent=2))
(ROOT/'assets'/'credits.json').write_text(json.dumps({k:{'credit':v['credit'],'source':v['source']} for k,v in data.items()},indent=2))
print('Sprite pack ready',flush=True)
