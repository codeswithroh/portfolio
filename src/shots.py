# Captures a viewport screenshot of every project with a live URL.
import os, re, subprocess, sys, pathlib, json
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
src = (root/'src/projects.mjs').read_text()
items = re.findall(r"slug: '([^']+)'.*?(?=slug: '|\Z)", src, re.S)
blocks = re.split(r"\n  \{ slug: ", src)[1:]
targets = []
for b in blocks:
    slug = re.match(r"'([^']+)'", b).group(1)
    m = re.search(r"url: '([^']+)'", b)
    if m: targets.append((slug, m.group(1)))
only = set(sys.argv[1:])
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get('CHROME') or None)
    ctx = br.new_context(viewport={'width':1280,'height':800}, device_scale_factor=1)
    for slug, url in targets:
        if only and slug not in only: continue
        pg = ctx.new_page(); out = root/f'assets/shots/{slug}.png'
        try:
            pg.goto(url, wait_until='load', timeout=25000); pg.wait_for_timeout(3500)
            pg.screenshot(path=str(out))
            subprocess.run(['cwebp','-quiet','-q','78','-resize','960','0',str(out),'-o',str(out.with_suffix('.webp'))],check=True)
            out.unlink(); print('ok',slug)
        except Exception as e: print('FAIL',slug,str(e)[:80])
        pg.close()
    br.close()
