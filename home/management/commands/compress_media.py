"""
Management command to compress all media images to WebP.
Run: python manage.py compress_media
"""
import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


class Command(BaseCommand):
    help = 'Compress all media images to WebP (quality 80)'

    def handle(self, *args, **options):
        if not PIL_AVAILABLE:
            self.stderr.write('Pillow is not installed. Run: pip install Pillow')
            return

        media_root = Path(settings.MEDIA_ROOT)
        if not media_root.exists():
            self.stdout.write('No media directory found.')
            return

        extensions = {'.jpg', '.jpeg', '.png'}
        converted = 0
        skipped = 0

        for img_path in media_root.rglob('*'):
            if img_path.suffix.lower() not in extensions:
                continue
            webp_path = img_path.with_suffix('.webp')
            if webp_path.exists():
                skipped += 1
                continue
            try:
                with Image.open(img_path) as img:
                    rgb = img.convert('RGB')
                    # Resize: cap at 800px wide (portraits/headshots don't need more)
                    if rgb.width > 800:
                        ratio = 800 / rgb.width
                        rgb = rgb.resize(
                            (800, int(rgb.height * ratio)),
                            Image.LANCZOS
                        )
                    rgb.save(webp_path, 'WEBP', quality=80, method=6)
                converted += 1
                self.stdout.write(f'  Converted: {img_path.relative_to(media_root)}')
            except Exception as e:
                self.stderr.write(f'  Failed {img_path.name}: {e}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone. Converted: {converted}, Already existed: {skipped}'
        ))
