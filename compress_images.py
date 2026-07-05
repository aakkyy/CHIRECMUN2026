"""
Run from project root: python compress_images.py
Converts all JPG/PNG in media/ to WebP at quality 80, max 800px wide.
"""
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

media = Path(__file__).parent / "media"
if not media.exists():
    print(f"No media/ folder found at {media}")
    exit(1)

converted = skipped = 0
for p in media.rglob("*"):
    if p.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    out = p.with_suffix(".webp")
    if out.exists():
        skipped += 1
        continue
    try:
        with Image.open(p) as img:
            rgb = img.convert("RGB")
            if rgb.width > 800:
                ratio = 800 / rgb.width
                rgb = rgb.resize((800, int(rgb.height * ratio)), Image.LANCZOS)
            rgb.save(out, "WEBP", quality=80, method=6)
        print(f"  ✓ {p.relative_to(media.parent)}")
        converted += 1
    except Exception as e:
        print(f"  ✗ {p.name}: {e}")

print(f"\nDone. Converted: {converted}, Skipped (already exist): {skipped}")
