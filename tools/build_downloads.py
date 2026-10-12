"""Rebuild the two downloadable ZIPs from the current source and local assets."""
from pathlib import Path
import hashlib
import json
import shutil
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
sprites = (DIST / 'assets' / 'sprites.js').read_text()
(DIST / 'assets' / 'sprites_manifest.json').write_text(json.dumps(json.loads(sprites.removeprefix('window.SPRITES=').removesuffix(';')), separators=(',', ':')))

DOWNLOADS = DIST / 'downloads'
if DOWNLOADS.exists():
    shutil.rmtree(DOWNLOADS)
DOWNLOADS.mkdir()
manifest = {}
CHUNK_SIZE = 20 * 1024 * 1024

def package(key, name, files):
    with tempfile.TemporaryDirectory(prefix='frontera-download-') as temp:
        output = Path(temp) / name
        with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for file, relative in sorted(files, key=lambda item: item[1]):
                entry = zipfile.ZipInfo(relative, date_time=(2026, 10, 10, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(entry, file.read_bytes())
        parts = []
        sha = hashlib.sha256()
        with output.open('rb') as source:
            while content := source.read(CHUNK_SIZE):
                part_name = name + '.' + str(len(parts) + 1).zfill(3)
                (DOWNLOADS / part_name).write_bytes(content)
                sha.update(content)
                parts.append({'url': 'downloads/' + part_name, 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest()})
        manifest[key] = {'filename': name, 'bytes': output.stat().st_size, 'sha256': sha.hexdigest(), 'parts': parts}
        print(name, output.stat().st_size, 'bytes;', len(parts), 'parts')
    (DIST / name).unlink(missing_ok=True)

package('sprites', 'recursos-sprites.zip', [(p, str(p.relative_to(DIST))) for p in (DIST / 'assets').rglob('*') if p.is_file()] + [(DIST / 'LEEME-sprites.md', 'LEEME-sprites.md')])
package('proyecto', 'proyecto.zip', [(p, str(p.relative_to(ROOT))) for p in DIST.rglob('*') if p.is_file() and p.suffix != '.zip' and DOWNLOADS not in p.parents and DIST / 'client' not in p.parents] + [(ROOT / 'README.md', 'README.md')] + [(p, str(p.relative_to(ROOT))) for p in (ROOT / 'tools').iterdir() if p.suffix in {'.py', '.mjs'}])
(DOWNLOADS / 'manifest.json').write_text(json.dumps(manifest, indent=2))
