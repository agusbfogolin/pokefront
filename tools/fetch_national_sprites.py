"""Import SpriteCollab animations without changing the original Kanto pack.

Run after fetch_generations.py: python tools/fetch_national_sprites.py
The six gameplay animations are resolved through upstream CopyOf references.
No species is substituted for another and downloaded sheets remain unmodified.
"""

import argparse
import concurrent.futures
import hashlib
import http.client
import json
import threading
import time
import urllib.request
import urllib.error
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image, ImageChops

try:
    import requests
except ImportError:
    requests = None

ROOT = Path(__file__).resolve().parents[1] / "dist" / "assets"
BASE = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/"
TRACKER_URL = BASE + "tracker.json"
PRESERVED = list(range(1, 152)) + [200]
ANIMATIONS = {
    "Idle": ["Idle"],
    "Walk": ["Walk", "Move", "Idle"],
    "Attack": ["Attack", "Strike", "Slam", "Swing", "Shoot", "Idle"],
    "Shoot": ["Shoot", "SpAttack", "Attack", "Strike", "Idle"],
    "Hurt": ["Hurt", "Pain", "Cringe", "Idle"],
    "Sleep": ["Sleep", "EventSleep", "Idle"],
}
# These are reviewed poses/forms of the same species, rather than another
# species, recolors, regional replacements, or invented animations.
APPROVED_FORMS = {
    668: {"path": "0668/0000/0000/0002", "spriteForm": "Female"},
    870: {"path": "0870/0003", "spriteForm": "Trooper", "formation": True},
    999: {"path": "0999/0001", "spriteForm": "Roaming"},
    1008: {"path": "1008/0001", "spriteForm": "Low_Power"},
}
LOCAL = threading.local()


def get_bytes(url):
    if requests is None:
        target = urllib.parse.urlparse(url)
        proxy = urllib.parse.urlparse(urllib.request.getproxies().get("https", ""))
        # urllib's default handler closes each connection. Reuse one TLS
        # connection per worker for the thousands of small upstream sheets.
        if target.scheme == "https" and not proxy.username:
            if not hasattr(LOCAL, "connection") or LOCAL.connection is None:
                LOCAL.connection = http.client.HTTPSConnection(
                    proxy.hostname or target.hostname,
                    proxy.port or (80 if proxy.hostname else 443), timeout=45)
                if proxy.hostname:
                    LOCAL.connection.set_tunnel(target.hostname, target.port or 443)
            try:
                LOCAL.connection.request("GET", target.path + ("?" + target.query if target.query else ""),
                                         headers={"User-Agent": "Pokemon-Frontera-sprite-importer"})
                response = LOCAL.connection.getresponse()
                payload = response.read()
                if response.status != 200:
                    raise urllib.error.HTTPError(url, response.status, response.reason, response.headers, None)
                return payload
            except Exception:
                LOCAL.connection.close()
                LOCAL.connection = None
                raise
        with urllib.request.urlopen(url, timeout=45) as response:
            return response.read()
    if not hasattr(LOCAL, "session"):
        LOCAL.session = requests.Session()
        LOCAL.session.headers["User-Agent"] = "Pokemon-Frontera-sprite-importer"
    response = LOCAL.session.get(url, timeout=(15, 45))
    response.raise_for_status()
    return response.content


def fetch(url, path):
    if path.exists() and path.stat().st_size:
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(5):
        try:
            payload = get_bytes(url)
            if not payload:
                raise ValueError("Empty upstream file: " + url)
            temporary = path.with_suffix(path.suffix + ".part")
            temporary.write_bytes(payload)
            temporary.replace(path)
            return path
        except Exception:
            if attempt == 4:
                raise
            time.sleep(min(8, 0.5 * 2 ** attempt))


def read_manifest():
    value = (ROOT / "sprites.js").read_text()
    return json.loads(value[value.index("=") + 1:].rstrip(";\n"))


def preserved_digest(manifest):
    files = {}
    for number in PRESERVED:
        for path in sorted((ROOT / str(number)).glob("*")):
            if path.is_file():
                files[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
    return {
        "manifest": {str(number): manifest[str(number)] for number in PRESERVED},
        "files": files,
    }


def white_anchor(frame, width, height):
    # Shadow sheets encode the origin as opaque white. Compute masks in PIL
    # instead of scanning every pixel in Python for every sprite frame.
    equal_255 = [0] * 255 + [255]
    masks = [channel.point(equal_255) for channel in frame.split()]
    mask = masks[0]
    for channel in masks[1:]:
        mask = ImageChops.multiply(mask, channel)
    bounds = mask.getbbox()
    if bounds is None:
        return [width // 2, height // 2 + 8]
    # Match the original importer's first white pixel in row-major order.
    top = bounds[1]
    left = mask.crop((0, top, width, top + 1)).getbbox()[0]
    return [left, top]


def resolve(definitions, requested):
    for candidate in ANIMATIONS[requested]:
        if candidate not in definitions:
            continue
        seen = set()
        resolved = candidate
        while resolved in definitions:
            if resolved in seen:
                raise ValueError("Circular CopyOf: " + resolved)
            seen.add(resolved)
            node = definitions[resolved]
            copy = node.findtext("CopyOf")
            if not copy:
                if not node.findtext("FrameWidth") or not node.findtext("FrameHeight"):
                    break
                return candidate, resolved, node
            resolved = copy
    raise ValueError("No animation for " + requested)


def import_species(number, tracker, upstream_override=None, destination_suffix=None):
    form = {} if upstream_override else APPROVED_FORMS.get(number, {})
    upstream = form.get("path", f"{number:04d}")
    if upstream_override:
        upstream = upstream_override
    remote = BASE + "sprite/" + upstream + "/"
    destination = ROOT / str(number)
    if destination_suffix:
        destination = destination / destination_suffix
    xml = fetch(remote + "AnimData.xml", destination / "AnimData.xml")
    credits = fetch(remote + "credits.txt", destination / "credits.txt").read_text()
    nodes = ET.parse(xml).getroot().find("Anims")
    definitions = {node.findtext("Name"): node for node in nodes}
    animations = {}
    sources = {}
    requested_fallbacks = {}
    cache = {}
    for requested in ANIMATIONS:
        candidate, actual, node = resolve(definitions, requested)
        sources[requested] = actual
        if candidate != requested:
            requested_fallbacks[requested] = candidate
        if actual not in cache:
            width = int(node.findtext("FrameWidth"))
            height = int(node.findtext("FrameHeight"))
            image = fetch(remote + actual + "-Anim.png", destination / (actual + "-Anim.png"))
            shadows = fetch(remote + actual + "-Shadow.png", destination / (actual + "-Shadow.png"))
            durations = [int(duration.text) / 60 for duration in node.find("Durations")]
            with Image.open(image) as original, Image.open(shadows) as original_shadow:
                sprite = original.convert("RGBA")
                shadow = original_shadow.convert("RGBA")
                if sprite.size != shadow.size:
                    raise ValueError(f"Mismatched shadow for {number} {actual}")
                if sprite.width % width or sprite.height % height:
                    raise ValueError(f"Invalid frame grid for {number} {actual}")
                columns, rows = sprite.width // width, sprite.height // height
                if columns != len(durations):
                    raise ValueError(f"Durations mismatch for {number} {actual}: {columns} / {len(durations)}")
                anchors = []
                bounds = []
                for row in range(rows):
                    row_anchors = []
                    row_bounds = []
                    for column in range(columns):
                        box = (column * width, row * height, (column + 1) * width, (row + 1) * height)
                        row_anchors.append(white_anchor(shadow.crop(box), width, height))
                        row_bounds.append(sprite.crop(box).getbbox())
                    anchors.append(row_anchors)
                    bounds.append(row_bounds)
            cache[actual] = {
                "file": "assets/" + str(destination.relative_to(ROOT)) + "/" + actual + "-Anim.png",
                "w": width, "h": height, "rows": rows,
                "durations": durations, "anchors": anchors, "bounds": bounds,
            }
        animations[requested] = cache[actual]
    result = {
        "animations": animations,
        "credit": credits,
        "source": "https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/" + upstream,
        "spriteModel": "pmd-formation" if form.get("formation") else "pmd",
        "animationSources": sources,
        "animationFallbacks": requested_fallbacks,
    }
    if form.get("spriteForm"):
        result["spriteForm"] = form["spriteForm"]
    if form.get("formation"):
        result["formation"] = True
        _, leader, leader_audit = import_species(number, tracker, "0870/0002", "leader")
        result["formationLeader"] = leader
        result["sources"] = [result["source"], leader["source"]]
        result["credit"] = ("Falinks Trooper: " + result["source"] + "\n" + credits
                           + "\nFalinks Brass: " + leader["source"] + "\n" + leader["credit"])
    coverage = {
        "name": tracker[f"{number:04d}"]["name"],
        "model": result["spriteModel"],
        "source": result["source"],
        "availableAnimations": list(definitions),
        "animationSources": sources,
        "animationFallbacks": requested_fallbacks,
    }
    if form.get("spriteForm"):
        coverage["spriteForm"] = form["spriteForm"]
    if form.get("formation"):
        coverage["formationLeader"] = leader_audit
    return number, result, coverage


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tracker", default="/tmp/frontera-sprite-tracker.json")
    parser.add_argument("--workers", type=int, default=24)
    parser.add_argument("--ids", help="Optional comma-separated species to refresh")
    args = parser.parse_args()
    tracker_path = Path(args.tracker)
    tracker = json.loads(fetch(TRACKER_URL, tracker_path).read_text())
    manifest = read_manifest()
    preserved = preserved_digest(manifest)
    credits = json.loads((ROOT / "credits.json").read_text())
    previous = ROOT / "sprite-coverage.json"
    coverage = json.loads(previous.read_text()) if previous.exists() else {"bySpecies": {}}
    selected = {int(value) for value in args.ids.split(",")} if args.ids else None
    candidates = [number for number in range(152, 1026) if number not in PRESERVED
                  and (selected is None or number in selected)
                  and ("Idle" in tracker[f"{number:04d}"].get("sprite_files", {}) or number in APPROVED_FORMS)]
    failed = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        jobs = {pool.submit(import_species, number, tracker): number for number in candidates}
        for completed, job in enumerate(concurrent.futures.as_completed(jobs), 1):
            number = jobs[job]
            try:
                number, record, audit = job.result()
                manifest[str(number)] = record
                credits[str(number)] = {"credit": record["credit"], "source": record["source"]}
                if record.get("sources"):
                    credits[str(number)]["sources"] = record["sources"]
                coverage["bySpecies"][str(number)] = audit
            except Exception as error:
                failed.append({"id": number, "error": str(error)})
                print(f"ERROR {number}: {error}", flush=True)
            if completed % 100 == 0 or completed == len(candidates):
                print(f"Imported {completed}/{len(candidates)}; errors {len(failed)}", flush=True)
    manifest = {str(number): manifest[str(number)] for number in range(1, 1026)}
    credits = {str(number): credits[str(number)] for number in range(1, 1026)}
    if preserved_digest(manifest) != preserved:
        raise AssertionError("Original Kanto/Misdreavus sprites changed")
    pmd = [number for number in range(1, 1026)
           if number in PRESERVED or manifest[str(number)].get("spriteModel", "").startswith("pmd")]
    flat = [number for number in range(1, 1026) if number not in pmd]
    for number in PRESERVED:
        record = manifest[str(number)]
        available = [node.findtext("Name") for node in
                     ET.parse(ROOT / str(number) / "AnimData.xml").getroot().find("Anims")]
        sources = {key: Path(animation["file"]).name.removesuffix("-Anim.png")
                   for key, animation in record["animations"].items()}
        coverage["bySpecies"][str(number)] = {
            "name": tracker[f"{number:04d}"]["name"], "model": "pmd", "preserved": True,
            "source": record["source"], "availableAnimations": available,
            "animationSources": sources,
            "animationFallbacks": {key: sources[key] for key in ANIMATIONS if key not in available},
        }
    for number in flat:
        coverage["bySpecies"][str(number)] = {
            "name": tracker[f"{number:04d}"]["name"], "model": "flat",
            "source": manifest[str(number)]["source"], "availableAnimations": [],
            "reason": "No usable default/species-form animation set in SpriteCollab",
        }
    coverage.update({
        "schemaVersion": 1,
        "source": "https://github.com/PMDCollab/SpriteCollab",
        "preservedSpecies": PRESERVED,
        "pmdSpecies": pmd,
        "flatSpecies": flat,
        "missing": [{"id": number, "name": tracker[f"{number:04d}"]["name"],
                     "reason": "No usable default/species-form animation set in SpriteCollab"} for number in flat],
        "totals": {"species": 1025, "pmd": len(pmd), "flat": len(flat),
                   "newImported": len(pmd) - len(PRESERVED),
                   "lastRunImported": len(candidates) - len(failed),
                   "sixNamedAnimations": sum(all(key in coverage["bySpecies"][str(number)]["availableAnimations"]
                                                  for key in ANIMATIONS) for number in pmd),
                   "formation": sum(bool(manifest[str(number)].get("formation")) for number in pmd)},
        "errors": failed,
    })
    coverage["bySpecies"] = {key: coverage["bySpecies"][key] for key in sorted(coverage["bySpecies"], key=int)}
    (ROOT / "sprites.js").write_text("window.SPRITES=" + json.dumps(manifest, separators=(",", ":")) + ";")
    (ROOT / "credits.json").write_text(json.dumps(credits, indent=2))
    (ROOT / "sprite-coverage.json").write_text(json.dumps(coverage, indent=2))
    print(json.dumps(coverage["totals"]), flush=True)
    print("Missing sprite sets: " + ", ".join(map(str, flat)), flush=True)
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
