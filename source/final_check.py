from pathlib import Path
import json
import re
import zipfile
root = Path(__file__).resolve().parent.parent / 'output'
package = root / 'identidade-raposa'
with zipfile.ZipFile(root / 'identidade-raposa-completa.zip') as archive:
    names = [name.replace('\\', '/') for name in archive.namelist()]
    bad_entry = archive.testzip()
html = (package / 'index.html').read_text(encoding='utf-8')
links = re.findall(r'(?:href|src)="([^"]+)"', html)
missing = [name for name in links if not name.startswith('#') and not (package / name).exists()]
result = {'zip_files': len(names), 'crc_error': bad_entry,
          'svg_files': sum(name.endswith('.svg') for name in names),
          'png_art_files': sum(name.endswith('.png') and '/validacao/' not in name and '/referencias/' not in name for name in names),
          'retired_pose_files': [name for name in names if '/07-poses/' in name],
          'missing_gallery_links': missing}
print(json.dumps(result, ensure_ascii=False))
assert bad_entry is None and not missing and not result['retired_pose_files']
assert result['svg_files'] == 37 and result['png_art_files'] == 40
