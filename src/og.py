# Renders 1200x630 social cards, favicons and PWA icons with headless Chromium.
import json, os, pathlib, subprocess
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent; a = root/'assets'
items = json.loads((a/'og/list.json').read_text())
tints = dict(mint='#D6F0C4', butter='#F9DF8B', sky='#BCD3F2', pink='#F8C8DF', peach='#F9C9A6', lilac='#D9CFF5')
FONT = f"@font-face{{font-family:F;src:url(file://{a}/fonts/fraunces-normal-300-700.woff2);font-weight:300 700}}@font-face{{font-family:F;font-style:italic;src:url(file://{a}/fonts/fraunces-italic-300-700.woff2);font-weight:300 700}}"
def card(title, sub, tint, shot):
    img = f'<img src="file://{a}/shots/{shot}.webp" style="position:absolute;right:-40px;bottom:-60px;width:680px;border-radius:14px;transform:rotate(-3deg);box-shadow:0 20px 50px rgba(0,0,0,.25)">' if shot else ''
    w = '470px' if shot else '1040px'
    return f'''<style>{FONT}*{{margin:0}}body{{width:1200px;height:630px;background:{tint};position:relative;overflow:hidden;font-family:F;color:#201C17}}</style>{img}
    <div style="position:absolute;left:60px;top:60px;bottom:60px;width:{w};display:flex;flex-direction:column"><div style="font-size:26px;font-style:italic;color:#B83A16">Rohit Purkait</div>
    <div style="font-size:74px;line-height:1.02;letter-spacing:-.02em;margin-top:auto">{title}</div><div style="font-size:31px;line-height:1.25;margin-top:18px">{sub}</div></div>'''
folder = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D9502A"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h5l2.5 3h7.5A2.5 2.5 0 0 1 22 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5z"/></svg>'
(a/'favicon.svg').write_text(folder)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get('CHROME') or None)
    pg = br.new_page(viewport={'width':1200,'height':630})
    def snap(html, name):
        f = a/'og/_t.html'; f.write_text(html); pg.goto(f'file://{f}'); pg.wait_for_timeout(120); pg.screenshot(path=str(a/f'og/{name}.jpg'), type='jpeg', quality=82)
    snap(card('Rohit Purkait', 'AI engineer and developer advocate. Creator of Tastemaker.', '#F7F2E8', 'tastemaker'), 'home')
    for it in items: snap(card(it['name'], it['tagline'], tints[it['tint']], it['slug'] if it['shot'] else None), it['slug'])
    (a/'og/_t.html').unlink()
    for s, n in [(32,'favicon-32.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:
        pad = 0 if s == 32 else int(s*.14); ig = br.new_page(viewport={'width':s,'height':s})
        ig.set_content(f'<body style="margin:0;background:{"transparent" if s==32 else "#F7F2E8"};padding:{pad}px;box-sizing:border-box;width:{s}px;height:{s}px">{folder}</body>')
        ig.screenshot(path=str(a/n), omit_background=True); ig.close()
    br.close()
(a/'og/list.json').unlink()
