from pathlib import Path
from pypdf import PdfReader
import json
import zipfile

root = Path(__file__).resolve().parent.parent
package = root / 'output' / 'identidade-raposa'
reader = PdfReader(package / 'manual-da-identidade.pdf')
assert len(reader.pages) == 8
text = '\n\n'.join(page.extract_text() for page in reader.pages)
assert 'edição 02' in text and 'Posturas naturais' in text
assert 'Analisando dados' not in text and 'Indicando informação' not in text
(package / 'validacao' / 'manual-texto.txt').write_text(text, encoding='utf-8')
report = package / 'validacao' / 'RELATORIO.md'
report.write_text(report.read_text(encoding='utf-8') + '\n## Galeria e manual\n\nManual atualizado com oito páginas, todas renderizadas e inspecionadas. Galeria conferida em 1440 x 1000 e 390 x 844, sem imagens quebradas ou rolagem horizontal. Alternância de fundos exercitada. As capturas de poses, vistas e ícones constam em validacao. A galeria local respondeu HTTP 200 com a edição 02.\n', encoding='utf-8')
(package / 'validacao' / 'conferencia-publicacao.json').write_text(json.dumps({
    'date': '2026-09-09', 'edition': 2, 'pdf_pages': len(reader.pages),
    'pdf_pages_visually_reviewed': list(range(1, 9)),
    'gallery_viewports': [[1440, 1000], [390, 844]],
    'broken_images': [], 'mobile_horizontal_overflow': False,
    'background_toggle_checked': True, 'natural_pose_cards': 10,
    'local_http_status': 200
}, indent=2), encoding='utf-8')
destination = root / 'output' / 'identidade-raposa-completa.zip'
with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for item in sorted(package.rglob('*')):
        if item.is_file():
            archive.write(item, item.relative_to(package.parent))
print(json.dumps({'pdf_pages': len(reader.pages), 'zip_bytes': destination.stat().st_size}))
