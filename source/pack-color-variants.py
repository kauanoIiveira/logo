from pathlib import Path
import json
import re
import zipfile

root = Path(__file__).resolve().parent.parent
base = root / 'output' / 'identidade-raposa'
variants = base / '08-variantes'
destination = root / 'output' / 'raposa-branca-e-preta.zip'
prefix = 'raposa-branca-e-preta/'
with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for item in sorted(variants.rglob('*')):
        if not item.is_file() or item.relative_to(variants).parts[0] == 'validacao-galeria':
            continue
        relative = item.relative_to(variants).as_posix()
        if relative == 'index.html':
            html = item.read_text(encoding='utf-8')
            html = html.replace('../04-sistema/', 'original/')
            html = html.replace('../index.html#cores', '#')
            html = html.replace('← Voltar ao guia da identidade', 'Raposa / variações de cor')
            html = re.sub(r'<a class="button primary" download href="../../raposa-branca-e-preta.zip">.*?</a>', '', html)
            archive.writestr(prefix + relative, html)
        else:
            archive.write(item, prefix + relative)
    for name in ('full-character', 'head-mark', 'brand-symbol'):
        for ext in ('svg', 'png'):
            archive.write(base / '04-sistema' / f'{name}.{ext}', prefix + f'original/{name}.{ext}')
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    members = set(archive.namelist())
    html = archive.read(prefix + 'index.html').decode('utf-8')
    links = re.findall(r'(?:href|src)="([^"]+)"', html)
    missing = [link for link in links if not link.startswith(('#', 'http', 'data:')) and prefix + link not in members]
    assert not missing, missing
    print(json.dumps({'zip': str(destination), 'files': len(members), 'bytes': destination.stat().st_size, 'missing_html_links': missing}))
