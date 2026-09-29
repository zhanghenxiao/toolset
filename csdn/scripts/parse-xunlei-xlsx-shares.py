"""Parse Xunlei share export xlsx -> JSON array on stdout."""
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def col_row(ref):
    col = ''.join(c for c in ref if c.isalpha())
    row = int(''.join(c for c in ref if c.isdigit()))
    return col, row


def load_strings(z):
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    out = []
    for si in root.findall('.//m:si', NS):
        parts = [t.text or '' for t in si.findall('.//m:t', NS)]
        out.append(''.join(parts))
    return out


def load_sheet(z, strings):
    root = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = {}
    for c in root.findall('.//m:sheetData/m:row/m:c', NS):
        ref = c.attrib.get('r', '')
        if not ref:
            continue
        col, row = col_row(ref)
        t = c.attrib.get('t')
        v = c.find('m:v', NS)
        if v is None:
            val = ''
        elif t == 's':
            val = strings[int(v.text)]
        else:
            val = v.text or ''
        rows.setdefault(row, {})[col] = val
    max_row = max(rows) if rows else 0
    table = []
    for r in range(1, max_row + 1):
        row = rows.get(r, {})
        table.append([row.get(chr(65 + i), '') for i in range(5)])
    return table


def main():
    path = sys.argv[1]
    with zipfile.ZipFile(path) as z:
        strings = load_strings(z)
        table = load_sheet(z, strings)

    shares = []
    for row in table[1:]:
        status, share_name, url, pwd = (row + ['', '', '', ''])[:4]
        if status != '成功' or not share_name.endswith('.txt'):
            continue
        url = (url or '').rstrip('#')
        if pwd and '?pwd=' not in url:
            url = f'{url}?pwd={pwd}'
        shares.append({'shareName': share_name, 'url': url})

    sys.stdout.buffer.write(json.dumps(shares, ensure_ascii=False).encode('utf-8'))


if __name__ == '__main__':
    main()
