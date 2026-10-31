// Zero-dependency static generator. Run `node src/build.mjs`; output is committed so Vercel serves it as is.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects, categories } from './projects.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.codeswithroh.online';
const TODAY = new Date().toISOString().slice(0, 10);
const EMAIL = 'rohitpurkait001@gmail.com';
// Display order: strongest screenshots first, then any other screenshot, then projects with no image.
const imageRank = ['nightfall', 'klyro', 'bhoot', 'streamreach', 'pitch-video', 'tastemaker', 'tape-verified', 'foundrproof', 'pakka', 'hall-monitor', 'handshake', 'overturn', 'mergepay', 'tracegate', 'drift', 'sextant', 'cofoundr', 'hourglass', 'baad-mein', 'capp', 'will-eth', 'yoldr', 'lumenshield'];
const rank = (p) => { const i = imageRank.indexOf(p.slug); return i >= 0 ? i : existsSync(join(root, `assets/shots/${p.slug}.webp`)) ? imageRank.length : imageRank.length + 1; };
projects.sort((a, b) => rank(a) - rank(b));
const facts = { stars: 509, forks: 53, repos2026: 65, chains: 18, hackathons: 20 };

const links = {
  github: 'https://github.com/codeswithroh', x: 'https://x.com/codeswithroh',
  linkedin: 'https://linkedin.com/in/rohitpurkait', youtube: 'https://youtube.com/@rohitpurkait4046',
};
const experience = [
  { co: 'BlokCapital', role: 'Developer Relations Engineer', when: 'Jan 2026 to now', note: 'Docs, SDK guides, quickstarts, workshops and open-source reference code for external builders.' },
  { co: 'Orbitxpay', role: 'Senior Backend Developer', when: '2025', note: 'Backend for a neobanking stack: payments engine and card issuing. Cut reporting latency by about 60%.' },
  { co: 'Metaborong', role: 'Full Stack Developer', when: '2024 to 2025', note: 'React and Next.js interfaces, shared component libraries, accessible UI.' },
  { co: 'PredictRAM', role: 'Software Developer I', when: '2022 to 2024', note: 'Led 20 people on a financial research platform for web and mobile.' },
];
const awards = [
  { name: 'EthGlobal 2025', what: 'Winner', when: '2025' },
  { name: 'PL_Genesis, Protocol Labs', what: 'Winner with Yoldr', when: '2025' },
  { name: 'SEBI National Hackathon', what: 'Jury Recommendation Award', when: '2023' },
  { name: 'Postman', what: 'Student Leader and Expert', when: '2022 to 2024' },
];
const education = [
  { name: 'IIT Madras', what: 'BS in Data Science, GPA 9.2', when: '2022 to 2025' },
  { name: 'Techno Main Salt Lake', what: 'BTech in Electrical Engineering, GPA 8.6', when: '2020 to 2024' },
];
const skills = {
  'Growth': ['Growth engineering', 'Social media strategy', 'Short-form video', 'SEO', 'Launch campaigns', 'Developer content'],
  'AI and LLMs': ['RAG', 'Agent pipelines', 'MCP', 'Multi-agent systems', 'Vector search', 'On-device models'],
  'Web3': ['EVM', 'Flow and Cadence', 'Polkadot and XCM', 'DeFi', 'ENS', 'Foundry'],
  'Languages': ['TypeScript', 'Python', 'Solidity', 'Cadence', 'Rust'],
  'Frameworks': ['Next.js', 'React', 'NestJS', 'FastAPI', 'viem and wagmi', 'PostgreSQL', 'MongoDB'],
};
const videos = [
  { id: '2046205861383807471', kind: 'Founder-led launch', t: 'cofoundr launch video', d: 'The launch video for my own product. I wrote the hook, filmed it, edited it and posted it.' },
  { id: '2085351218965078346', kind: 'Technical build', t: 'FHE Liar’s Dice on Fhenix CoFHE', d: 'The content is a working game I built. Dice stay encrypted on-chain until the reveal, so "confidential compute" stops being abstract.' },
  { id: '2086804614146666926', kind: 'Technical explainer', t: 'Fixing 1970s cross-border payment rails', d: 'How Sera replaces the correspondent-banking chain with on-chain settlement. Infrastructure-level, not a sponsor read.' },
  { id: '2086375097187877121', kind: 'Sponsored integration', t: 'Willow Voice in a real workflow', d: 'Willow woven through ChatGPT, Gmail, Slack and coding, built around the moment typing starts to feel slow.' },
  { id: '2088925623779799475', kind: 'Tutorial', t: 'Picking a local LLM without guessing', d: 'Starts from a frozen machine and the wrong Ollama model, then covers RAM, storage and GPU, and how local.ai removes the guessing.' },
  { id: '2087534144523804705', kind: 'Rapid reaction', t: 'OpenAI Health, explained the same day', d: 'What it connects to, what it does, and whether you would trust AI with your medical history, while it was still the day’s news.' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icon = (n) => readFileSync(join(root, `assets/icons/${n}.svg`), 'utf8').replace(/^<svg[^>]*?(viewBox="[^"]*")[^>]*>/, '<svg class="ic" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" $1>');
const hasShot = (p) => existsSync(join(root, `assets/shots/${p.slug}.webp`));
const tint = (p) => categories[p.cat].tint;
const metaDesc = (s) => { if (s.length <= 158) return s; const c = s.slice(0, 158); return c.slice(0, c.lastIndexOf('. ') > 80 ? c.lastIndexOf('. ') + 1 : c.lastIndexOf(' ')); };
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const mark = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h5l2.5 3h7.5A2.5 2.5 0 0 1 22 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5z"/></svg>`;

const person = {
  '@type': 'Person', '@id': `${SITE}/#person`, name: 'Rohit Purkait', alternateName: 'codeswithroh', url: `${SITE}/`,
  image: `${SITE}/assets/rohit-purkait.jpg`, email: `mailto:${EMAIL}`, jobTitle: ['Growth Engineer', 'AI Engineer', 'Social Media Strategist', 'Developer Relations Engineer'],
  description: 'Growth engineer, AI engineer and social media strategist. Won 20+ hackathons. Creator of Tastemaker, a Claude Code skill with 509 GitHub stars.',
  worksFor: { '@type': 'Organization', name: 'BlokCapital' },
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Madras' }, { '@type': 'CollegeOrUniversity', name: 'Techno Main Salt Lake' }],
  knowsAbout: ['Growth engineering', 'Social media strategy', 'Short-form video', 'SEO', 'AI agents', 'Model Context Protocol', 'Claude Code skills', 'On-device AI', 'Developer relations', 'Solidity', 'DeFi', 'TypeScript'],
  award: ['Winner of 20+ hackathons', ...awards.slice(0, 3).map((a) => `${a.name}: ${a.what}`)],
  sameAs: [links.github, links.x, links.linkedin, links.youtube, 'https://github.com/CodeswithrohStudio'],
};

function layout({ path, title, desc, body, jsonld = [], active, og = '/assets/og/home.jpg', type = 'website' }) {
  const canonical = SITE + (path === '/' ? '/' : path);
  const nav = [['/projects', 'Work', 'work'], ['/about', 'About', 'about'], ['/proof-of-work', 'Videos', 'videos']]
    .map(([h, l, k]) => `<a class="l" href="${h}"${active === k ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc(desc))}">
<link rel="canonical" href="${canonical}">
<meta name="author" content="Rohit Purkait">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#F7F2E8">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Rohit Purkait">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(metaDesc(desc))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@codeswithroh">
<meta name="twitter:creator" content="@codeswithroh">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(metaDesc(desc))}">
<meta name="twitter:image" content="${SITE}${og}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="me" href="${links.github}">
<link rel="me" href="${links.x}">
<link rel="preload" href="/assets/fonts/zodiak-italic-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
${jsonld.map(ld).join('\n')}
</head>
<body>
<div class="bar" aria-hidden="true"></div>
<a class="skip" href="#main">Skip to content</a>
<nav class="nav" aria-label="Main">
<a class="brand" href="/" aria-label="Rohit Purkait, home">${mark}<span class="hide">rohit</span></a>
${nav}
<a class="cta" href="/#contact">Hire me</a>
</nav>
<main id="main">
${body}
</main>
<footer class="wrap foot">
<span>Rohit Purkait · India</span>
<span><a href="${links.github}" rel="me">GitHub</a><a href="${links.x}" rel="me">X</a><a href="${links.linkedin}" rel="me">LinkedIn</a><a href="${links.youtube}" rel="me">YouTube</a><a href="mailto:${EMAIL}">Email</a></span>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

const shot = (p, w = 960) => hasShot(p) ? `<img src="/assets/shots/${p.slug}.webp" width="${w}" height="600" alt="Screenshot of ${esc(p.name)}: ${esc(p.tagline)}" loading="lazy" decoding="async">` : '';
const pcard = (p) => `<a class="pcard t-${tint(p)}" data-c="${p.cat}" href="/projects/${p.slug}">
<div class="th">${hasShot(p) ? shot(p) : `<div class="code">${esc(p.name)}</div>`}</div>
<div class="b"><h3>${esc(p.name)}</h3><p>${esc(p.tagline)}</p><span class="mono">${esc(p.stat)}</span></div></a>`;
const contact = `<section class="wrap sec" id="contact"><div class="contact" data-r>
<h2>Need someone who builds it and sells it?</h2>
<p>I’m open to growth, social and DevRel roles, plus hard technical builds. I reply fast.</p>
<div class="btns" style="justify-content:center"><a class="btn" href="mailto:${EMAIL}">${icon('mail')} ${EMAIL}</a><a class="btn alt" href="${links.x}">DM on X</a></div>
</div></section>`;

// Home
const by = Object.fromEntries(projects.map((p) => [p.slug, p]));
const featured = projects.filter((p) => p.featured).sort((a, b) => a.featured - b.featured);
const pills = ['Growth', 'Claude Code', 'Short video', 'MCP', 'Solidity', 'SEO', 'Gemma', 'TypeScript', 'Rust', 'X threads', 'Next.js'];
const marquee = ['Growth engineering', 'Social media strategy', 'AI agents', 'Short-form video', 'SEO', 'Launch campaigns', 'On-device AI', 'Developer content', 'Onchain apps'];
function starChart() {
  const days = readFileSync(join(root, 'src/stars.txt'), 'utf8').trim().split('\n');
  const start = new Date(days[0]), end = new Date(days.at(-1)), span = (end - start) / 864e5;
  const counts = {}; days.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
  const W = 620, H = 170, pts = []; let total = 0, peak = ['', 0, 0, 0];
  for (let i = 0; i <= span; i++) {
    const d = new Date(+start + i * 864e5).toISOString().slice(0, 10), c = counts[d] || 0; total += c;
    const x = +(i / span * W).toFixed(1), y = +(H - total / days.length * H).toFixed(1); pts.push(`${x},${y}`);
    if (c > peak[1]) peak = [d, c, x, y];
  }
  return `<svg viewBox="0 -14 ${W} ${H + 36}" role="img" aria-label="Line chart of Tastemaker GitHub stars rising from 0 in July 2026 to ${facts.stars} in October 2026, with a jump of ${peak[1]} stars on one day in August."><polygon class="ar" points="0,${H} ${pts.join(' ')} ${W},${H}"/><polyline class="ln" pathLength="1" points="${pts.join(' ')}"/><g class="pkg"><circle cx="${peak[2]}" cy="${peak[3]}" r="5" fill="#201C17"/><text class="pk" x="${peak[2] - 12}" y="${peak[3] - 10}" text-anchor="end">+${peak[1]} in a day</text><circle cx="${W}" cy="0" r="5" fill="#D9502A"/></g><text class="ax" x="0" y="${H + 18}">Jul 2026</text><text class="ax" x="${W}" y="${H + 18}" text-anchor="end">Oct 2026</text></svg>`;
}
const home = layout({
  path: '/', title: 'Rohit Purkait | Growth Engineer and AI Engineer',
  desc: 'Rohit Purkait (codeswithroh) is a growth engineer, AI engineer and social media strategist. 20+ hackathons won. Built Tastemaker, 509 GitHub stars.',
  jsonld: [{ '@context': 'https://schema.org', '@graph': [person, { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'Rohit Purkait', alternateName: 'codeswithroh', publisher: { '@id': `${SITE}/#person` } }] }],
  body: `
<header class="wrap hero">
<h1>Rohit Purkait<span class="roles"><b class="on">Growth engineer</b><b>AI engineer</b><b>Social media strategist</b></span></h1>
<p class="sub">I build the product, then I get it seen. ${facts.hackathons}+ hackathons won, ${facts.stars} stars on my last launch, and every video made by me.</p>
<div class="btns"><a class="btn" href="/#contact">Hire me</a><a class="btn alt" href="/#growth">See the growth</a></div>
<div class="pocket">
<a class="card" style="left:0;--rot:-7deg;--i:0" href="/projects/tastemaker"><img src="/assets/shots/tastemaker.webp" width="960" height="600" alt="Tastemaker landing page"></a>
<a class="card" style="left:21%;--rot:-2deg;bottom:84px;--pos:0 0;--i:1" href="/projects/nightfall"><img src="/assets/shots/nightfall.webp" width="960" height="600" alt="Nightfall battle royale game"></a>
<div class="card note" style="left:44%;--rot:3deg;bottom:80px;--i:2">Half engineer, half growth. I write the code and the thread that sells it.</div>
<a class="card" style="left:67%;--rot:7deg;--pos:50% 40%;--i:3" href="/about"><img src="/assets/rohit-purkait.jpg" width="460" height="460" alt="Rohit Purkait looking up at the sky"></a>
<div class="flap" aria-hidden="true">namaste</div>
</div>
<nav class="dock" aria-label="Find me elsewhere">
<a href="${links.github}" rel="me" style="background:#201C17" aria-label="GitHub">${icon('github')}</a>
<a href="${links.x}" rel="me" style="background:#fff;border:1px solid var(--line)" class="dark" aria-label="X">${icon('x')}</a>
<a href="${links.linkedin}" rel="me" style="background:#0A66C2" aria-label="LinkedIn">${icon('linkedin')}</a>
<a href="${links.youtube}" rel="me" style="background:#D62B20" aria-label="YouTube">${icon('youtube')}</a>
<i></i>
<a href="mailto:${EMAIL}" style="background:var(--butter)" class="dark" aria-label="Email">${icon('mail')}</a>
</nav>
</header>

<div class="marq" aria-hidden="true"><div>${[0, 1].map(() => `<ul>${marquee.map((m) => `<li>${m}</li>`).join('')}</ul>`).join('')}</div></div>

<section class="wrap sec" aria-label="Numbers">
<div class="stats" data-r>
<div><strong data-n="${facts.hackathons}" data-s="+">${facts.hackathons}+</strong><span>hackathons won</span></div>
<div><strong data-n="${facts.stars}">${facts.stars}</strong><span>GitHub stars on Tastemaker</span></div>
<div><strong data-n="${facts.repos2026}">${facts.repos2026}</strong><span>public repos in 2026</span></div>
<div><strong data-n="${facts.chains}">${facts.chains}</strong><span>chains shipped on</span></div>
</div>
</section>

<section class="wrap" style="padding-bottom:72px" id="growth">
<div class="sec-head" data-r><h2>I ship it, then I get it <em>seen</em></h2></div>
<div class="growth">
<div class="chart" data-r><span class="mono">Tastemaker, GitHub stars</span><h3>0 to ${facts.stars} in under four months</h3>${starChart()}<div class="does">${['Growth engineering', 'Social media strategy', 'Short-form video', 'SEO', 'Launch campaigns'].map((x) => `<span>${x}</span>`).join('')}</div></div>
<div class="side-t">
<a class="gt t-butter" href="/projects/cofoundr" data-r><strong>500+</strong><p>organic users on cofoundr with zero paid acquisition.</p></a>
<a class="gt t-pink" href="/proof-of-work" data-r><strong>6 videos</strong><p>Scripted, filmed, edited and posted solo, sponsors included.</p></a>
</div></div>
</section>

<section class="wrap" aria-label="About">
<div class="bento" data-r>
<a class="tile t-folder" href="/about"><div class="sheet">rohit_resume_final_v3</div><div class="fold"><h3>About me</h3><span aria-hidden="true">${icon('arrow-right')}</span></div></a>
<a class="tile t-tomato" href="/projects/chithi"><p>My mom reads Bengali, not English. So I built Chithi: point a phone at a bill and hear it in your language.</p><span class="u">22 Indian languages ${icon('arrow-up-right')}</span></a>
<div class="tile t-photo"><img src="/assets/rohit-purkait.jpg" width="460" height="460" alt="Rohit Purkait outdoors under a cloudy sky" loading="lazy"></div>
<div class="tile t-status"><ul><li><span><i class="dot"></i>Open to</span><span>Growth, DevRel</span></li><li><span>Local</span><span id="clock">IST</span></li><li><span>Online as</span><span>codeswithroh</span></li></ul><h3>I reply fast</h3></div>
<div class="tile t-role"><span class="mono">Current role</span><h3>DevRel Engineer at BlokCapital</h3></div>
<div class="tile t-skills"><h3>What I work in</h3><span class="mono">Throw them around</span><div class="pills" aria-label="Skills">${pills.map((t) => `<span>${t}</span>`).join('')}</div></div>
<a class="tile t-video" href="/about"><h3>${facts.hackathons}+ hackathons won</h3><span class="mono" style="color:var(--ink)">EthGlobal, PL_Genesis, SEBI and more ${icon('arrow-right')}</span></a>
</div>
</section>

<section class="wrap sec" id="work">
<div class="sec-head"><h2>Selected <em>work</em></h2><a class="more" href="/projects">All ${projects.length} projects ${icon('arrow-right')}</a></div>
${featured.map((p) => `<article class="case t-${tint(p)}" data-r>
<div class="meta"><span class="mono">${p.year} · ${categories[p.cat].label}</span><h3><a href="/projects/${p.slug}" style="text-decoration:none">${esc(p.name)}</a></h3><p class="tag">${esc(p.tagline)}</p>
<p class="stat">${esc(p.stat)}</p><a class="more" style="margin-top:14px" href="/projects/${p.slug}">View project ${icon('arrow-right')}</a></div>
<a class="pic" href="/projects/${p.slug}" tabindex="-1" aria-hidden="true">${shot(p).replace(/alt="[^"]*"/, 'alt=""')}</a>
</article>`).join('\n')}
</section>

<section class="wrap sec" aria-labelledby="cats">
<div class="sec-head"><h2 id="cats">Six things I keep <em>building</em></h2></div>
<div class="cats">${Object.entries(categories).map(([k, c]) => `<a class="cat t-${c.tint}" href="/projects#${k}" data-r><h3>${c.label}</h3><p>${c.blurb}</p><span class="n">${projects.filter((p) => p.cat === k).length} projects ${icon('arrow-right')}</span></a>`).join('')}</div>
</section>

<section class="wrap sec" aria-label="Experience and awards">
<div class="two">
<div class="panel" data-r><h3>Work log</h3><ul class="tl">${experience.map((e) => `<li><b>${e.co}</b><span>${e.role}</span><span class="mono">${e.when}</span></li>`).join('')}</ul></div>
<div class="panel" data-r><h3>${facts.hackathons}+ hackathon wins, including</h3><ul class="tl">${awards.map((e) => `<li><b>${e.name}</b><span>${e.what}</span><span class="mono">${e.when}</span></li>`).join('')}</ul></div>
</div>
</section>
${contact}`,
});

// Projects index
const projectsPage = layout({
  path: '/projects', active: 'work', title: `Projects by Rohit Purkait: ${projects.length} AI, agent and onchain builds`,
  desc: `${projects.length} products by Rohit Purkait: Claude Code skills, on-device Gemma apps, x402 agent payments, DeFi vaults and privacy games, with live demos and source.`,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Projects by Rohit Purkait', url: `${SITE}/projects`, author: { '@id': `${SITE}/#person` },
    mainEntity: { '@type': 'ItemList', numberOfItems: projects.length, itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/projects/${p.slug}`, name: p.name })) } }],
  body: `<header class="wrap page-h"><h1>Everything worth <em>clicking</em></h1><p class="lead">${projects.length} projects, most of them from 2026. Open-source unless marked otherwise, and most have a live demo.</p></header>
<section class="wrap" style="padding-bottom:40px">
<div class="chips" role="group" aria-label="Filter by category"><button data-c="all" aria-pressed="true">All</button>${Object.entries(categories).map(([k, c]) => `<button data-c="${k}" aria-pressed="false">${c.label}</button>`).join('')}</div>
<div class="grid">${projects.map(pcard).join('\n')}</div>
</section>${contact}`,
});

// One page per project
const projectPage = (p, i) => {
  const c = categories[p.cat], url = `${SITE}/projects/${p.slug}`;
  const related = projects.filter((q) => q.cat === p.cat && q.slug !== p.slug).slice(0, 3);
  const entity = p.url
    ? { '@type': 'SoftwareApplication', name: p.name, url: p.url, applicationCategory: c.label, operatingSystem: 'Web', description: p.desc, author: { '@id': `${SITE}/#person` }, ...(p.repo ? { sameAs: p.repo } : {}), ...(hasShot(p) ? { screenshot: `${SITE}/assets/shots/${p.slug}.webp` } : {}) }
    : { '@type': 'SoftwareSourceCode', name: p.name, codeRepository: p.repo, url, description: p.desc, author: { '@id': `${SITE}/#person` }, programmingLanguage: p.stack[0] };
  return layout({
    path: `/projects/${p.slug}`, active: 'work', title: p.title.length > 44 ? p.title : `${p.title} | Rohit Purkait`, desc: p.desc, og: `/assets/og/${p.slug}.jpg`, type: 'article',
    jsonld: [{ '@context': 'https://schema.org', '@graph': [entity, { '@type': 'BreadcrumbList', itemListElement: [['Home', `${SITE}/`], ['Projects', `${SITE}/projects`], [p.name, url]].map(([name, item], n) => ({ '@type': 'ListItem', position: n + 1, name, item })) }] }],
    body: `<header class="wrap page-h">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/projects">Projects</a> / ${esc(p.name)}</nav>
<h1>${esc(p.name)}</h1><p class="lead">${esc(p.tagline)}</p>
<div class="btns" style="margin-top:22px">${p.url ? `<a class="btn" href="${p.url}">Open live app ${icon('arrow-up-right')}</a>` : ''}${p.repo ? `<a class="btn${p.url ? ' alt' : ''}" href="${p.repo}">${icon('github')} Source</a>` : ''}</div>
</header>
<section class="wrap">${hasShot(p)
  ? `<div class="shot t-${c.tint}"><img src="/assets/shots/${p.slug}.webp" width="960" height="600" alt="Screenshot of ${esc(p.name)}: ${esc(p.tagline)}" fetchpriority="high"></div>`
  : `<div class="shot code t-${c.tint}">${esc(p.tagline)}</div>`}</section>
<section class="wrap detail">
<div><h2>What it does</h2><p>${esc(p.desc)}</p><h2 style="margin-top:32px">Worth knowing</h2><ul class="pts">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
<aside class="side"><dl><dt>Year</dt><dd>${p.year}</dd><dt>Category</dt><dd><a href="/projects#${p.cat}">${c.label}</a></dd><dt>Status</dt><dd>${esc(p.stat)}</dd><dt>Stack</dt><dd class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</dd><dt>Built by</dt><dd><a href="/about">Rohit Purkait</a></dd></dl></aside>
</section>
<section class="wrap" style="padding-bottom:30px"><div class="sec-head"><h2 style="font-size:32px">More ${c.label.toLowerCase()}</h2></div><div class="grid">${related.map(pcard).join('')}</div></section>
${contact}`,
  });
};

// About
const about = layout({
  path: '/about', active: 'about', title: 'About Rohit Purkait | Growth Engineer, AI Engineer, IIT Madras', type: 'profile',
  desc: 'Rohit Purkait is a growth engineer, AI engineer and social media strategist with 20+ hackathon wins. IIT Madras data science graduate, creator of Tastemaker.',
  jsonld: [{ '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${SITE}/about`, mainEntity: person }],
  body: `<header class="wrap page-h"><h1>About <em>Rohit</em></h1><p class="lead">I’m a growth engineer, AI engineer and social media strategist from India. Online I’m codeswithroh.</p></header>
<section class="wrap detail" style="padding-top:0">
<div class="prose">
<p>I do both halves of a launch. I build the product, and I run what gets it noticed: social strategy, short video, SEO and developer content. I’ve won ${facts.hackathons}+ hackathons along the way.</p>
<p>I build fast and in public: ${facts.repos2026} public repos so far in 2026, across agent tools, on-device AI and onchain apps. My most used project is <a href="/projects/tastemaker">Tastemaker</a>, a skill that stops coding agents shipping the same generic UI. It has ${facts.stars} GitHub stars and ${facts.forks} forks.</p>
<p>One idea runs through most of it: software should check its own work. In Pakka and Baad Mein the model reads and code verifies. In MergePay and Handshake the contract checks the work before money moves. In Bhoot, git vouches for every claim. Models are good enough to act now, and the useful question is who verifies them.</p>
<p>By day I’m a Developer Relations Engineer at BlokCapital, where I write the docs, SDK guides and reference code that get outside developers to a first integration. Before that I built neobanking backends at Orbitxpay and frontends at Metaborong.</p>
<p>I also make videos. I write, film, edit and post them myself, and you can see <a href="/proof-of-work">six of them here</a>. Lately I’ve been drawn to small tools for real people, like <a href="/projects/chithi">Chithi</a>, which reads bills aloud for my family in Bengali, and <a href="/projects/pakka">Pakka</a>, which turns a home baker’s WhatsApp orders into a bake sheet.</p>
</div>
<div class="t-photo" style="border-radius:var(--r);overflow:hidden"><img src="/assets/rohit-purkait.jpg" width="460" height="460" alt="Portrait of Rohit Purkait outdoors"></div>
</section>
<section class="wrap" style="padding-bottom:14px"><div class="panel"><h2 style="font-size:30px;margin-bottom:12px">Experience</h2><ul class="tl">${experience.map((e) => `<li><b>${e.co}</b><span>${e.role}</span><span class="mono">${e.when}</span><p>${e.note}</p></li>`).join('')}</ul></div></section>
<section class="wrap" style="padding-bottom:14px"><div class="two">
<div class="panel"><h2 style="font-size:30px;margin-bottom:12px">${facts.hackathons}+ hackathon wins, including</h2><ul class="tl">${awards.map((e) => `<li><b>${e.name}</b><span>${e.what}</span><span class="mono">${e.when}</span></li>`).join('')}</ul></div>
<div class="panel"><h2 style="font-size:30px;margin-bottom:12px">Education</h2><ul class="tl">${education.map((e) => `<li><b>${e.name}</b><span>${e.what}</span><span class="mono">${e.when}</span></li>`).join('')}</ul></div>
</div></section>
<section class="wrap"><div class="skills">${Object.entries(skills).map(([k, v]) => `<div class="panel"><h2 style="font-size:23px;margin-bottom:10px">${k}</h2><div class="stack">${v.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('')}</div></section>
${contact}`,
});

// Videos
const pow = layout({
  path: '/proof-of-work', active: 'videos', title: 'Rohit Purkait: DevRel and Technical Video Portfolio',
  desc: 'Six developer videos written, filmed, edited and posted solo by Rohit Purkait: technical explainers, sponsor integrations, a same-day reaction and an on-chain build.',
  jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'DevRel and video portfolio', url: `${SITE}/proof-of-work`, author: { '@id': `${SITE}/#person` } }],
  body: `<header class="wrap page-h"><h1>Proof of <em>work</em></h1><p class="lead">Six videos I wrote, filmed, edited and posted on my own. No team and no agency. This is what I’d bring to a DevRel or video role.</p></header>
<section class="wrap"><div class="vid">${videos.map((v) => `<article data-r><span class="mono">${v.kind}</span><h2>${esc(v.t)}</h2><p>${esc(v.d)}</p><div class="e"><blockquote class="twitter-tweet" data-dnt="true"><a href="https://twitter.com/codeswithroh/status/${v.id}">Watch on X</a></blockquote></div></article>`).join('')}</div></section>
${contact}`,
});

const notFound = layout({
  path: '/404', title: 'Page not found | Rohit Purkait', desc: 'This page does not exist.',
  body: `<header class="wrap page-h" style="min-height:50vh"><h1>Nothing in this <em>folder</em></h1><p class="lead">That page moved or never existed.</p><div class="btns" style="margin-top:22px"><a class="btn" href="/projects">See all projects</a><a class="btn alt" href="/">Home</a></div></header>`,
}).replace('content="index,follow,max-image-preview:large"', 'content="noindex"');

['site.css', 'site.js'].forEach((f) => copyFileSync(join(root, 'src', f), join(root, 'assets', f)));
const out = (f, s) => { const p = join(root, f); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
out('index.html', home); out('projects.html', projectsPage); out('about.html', about); out('proof-of-work.html', pow); out('404.html', notFound);
projects.forEach((p, i) => out(`projects/${p.slug}.html`, projectPage(p, i)));

const urls = ['/', '/projects', '/about', '/proof-of-work', ...projects.map((p) => `/projects/${p.slug}`)];
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`);
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
out('site.webmanifest', JSON.stringify({ name: 'Rohit Purkait', short_name: 'Rohit', start_url: '/', display: 'browser', background_color: '#F7F2E8', theme_color: '#F7F2E8', icons: [{ src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }] }));
out('llms.txt', `# Rohit Purkait\n\n> Growth engineer, AI engineer and social media strategist, online as codeswithroh. Winner of 20+ hackathons. Developer Relations Engineer at BlokCapital. Creator of Tastemaker, a Claude Code skill with ${facts.stars} GitHub stars.\n\n## Pages\n- [About](${SITE}/about): background, experience, awards, education\n- [Projects](${SITE}/projects): every project\n- [Videos](${SITE}/proof-of-work): developer video work\n\n${Object.entries(categories).map(([k, c]) => `## ${c.label}\n${projects.filter((p) => p.cat === k).map((p) => `- [${p.name}](${SITE}/projects/${p.slug}): ${p.tagline}`).join('\n')}`).join('\n\n')}\n\n## Contact\n- Email: ${EMAIL}\n- GitHub: ${links.github}\n- X: ${links.x}\n- LinkedIn: ${links.linkedin}\n`);
if (process.argv[2] === '--og') writeFileSync(join(root, 'assets/og/list.json'), JSON.stringify(projects.map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, tint: tint(p), shot: hasShot(p) }))));
console.log(`built ${urls.length} pages`);
