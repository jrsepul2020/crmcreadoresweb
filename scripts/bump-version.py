#!/usr/bin/env python3
"""Sube la versión de la app antes de cada commit/subida a GitHub.

Escribe en index.html la constante APP_VERSION con la versión (1.<nº de commit que se va a crear>)
y la fecha y hora actuales; la app las muestra junto a la campana y en el menú lateral.

Uso (desde la raíz del repositorio):  python3 scripts/bump-version.py && git add index.html
"""
import re
import subprocess
import sys
from datetime import datetime

try:
    n = int(subprocess.check_output(['git', 'rev-list', '--count', 'HEAD'], text=True).strip()) + 1
except Exception:
    n = 1
fecha = datetime.now().astimezone().isoformat(timespec='seconds')

with open('index.html', encoding='utf-8') as f:
    html = f.read()
nuevo, c = re.subn(r"const APP_VERSION = \{[^}]*\};", "const APP_VERSION = { numero: '1.%d', fecha: '%s' };" % (n, fecha), html)
if c != 1:
    sys.exit('No se encontró APP_VERSION en index.html')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(nuevo)
print('Versión 1.%d · %s' % (n, fecha))
