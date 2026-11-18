"""Makes the small (-sm.webp) copies the site serves to phones, and re-saves large photos at a
web quality. Run after adding or replacing photos: python3 scripts/optimize-images.py
Needs Pillow (pip install pillow). Already-optimised files are left alone."""
import glob
import os

from PIL import Image

SMALL = 360  # longest side of the small copy, in pixels (flowers: 240)
QUALITY = 74

for path in sorted(glob.glob("public/img/flowers/*.webp") + glob.glob("public/img/projects/*.webp") + glob.glob("public/img/concepts/*.webp")):
    if path.endswith("-sm.webp"):
        continue
    im = Image.open(path)
    im.load()
    small = path[: -len(".webp")] + "-sm.webp"
    if not os.path.exists(small):
        copy = im.copy()
        size = 240 if "/flowers/" in path else SMALL
        copy.thumbnail((size, size), Image.LANCZOS)
        copy.save(small, "WEBP", quality=QUALITY, method=6)
    # Re-save the full-size photo only if that makes it at least 15% smaller.
    tmp = path + ".tmp"
    im.save(tmp, "WEBP", quality=QUALITY + 4, method=6)
    if os.path.getsize(tmp) < os.path.getsize(path) * 0.85:
        os.replace(tmp, path)
    else:
        os.remove(tmp)
