from pathlib import Path
from pypdf import PdfReader
import json
import zipfile

root = Path(__file__).resolve().parent.parent
package = root / 'output' / 'identidade-raposa'
reader = PdfReader(package / 'manual-da-identidade.pdf')
assert len(reader.pages) == 7
text = '\n\n'.join(page.extract_text() for page in reader.pages)
assert 'edição 03' in text and 'Correção do corpo' in text
assert 'Espreguiçando-se' not in text and 'Olhando para trás' not in text
(package / 'validacao' / 'manual-texto.txt').write_text(text, encoding='utf-8')
(package / 'validacao' / 'conferencia-publicacao.json').write_text(json.dumps({
    'date': '2026-09-09', 'edition': 3, 'pdf_pages': 7,
    'pdf_pages_visually_reviewed': list(range(1, 8)),
    'gallery_viewports': [[1440, 1000], [390, 844]],
    'broken_images': [], 'mobile_horizontal_overflow': False,
    'body_studies': 3, 'local_http_status': 200,
    'retired_assets_referenced_in_gallery': False
}, indent=2), encoding='utf-8')
destination = root / 'output' / 'identidade-raposa-completa.zip'
with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for item in sorted(package.rglob('*')):
        if item.is_file():
            archive.write(item, item.relative_to(package.parent))
print(json.dumps({'pdf_pages': len(reader.pages), 'zip_bytes': destination.stat().st_size}))
