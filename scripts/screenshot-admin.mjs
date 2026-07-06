// Admin 内部截图（用 puppeteer-core + 系统 Chrome + 注入 session）
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.resolve('dist-screenshots');

const ADMIN_PAGES = [
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-gifts', path: '/admin/gifts' },
  { name: 'admin-orders', path: '/admin/orders' },
  { name: 'admin-users', path: '/admin/users' },
  { name: 'admin-content', path: '/admin/content' },
  { name: 'admin-memory', path: '/admin/memory' },
  { name: 'admin-finance', path: '/admin/finance' }
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 420, height: 820, deviceScaleFactor: 2 });

  // Step 1: 访问 login 注入 session
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('gp-admin-session', JSON.stringify({ loginAt: Date.now() }));
  });

  for (const p of ADMIN_PAGES) {
    const url = `${BASE}${p.path}`;
    const out = path.join(OUT_DIR, `${p.name}.png`);
    console.log(`  → ${p.name}: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise((r) => setTimeout(r, 1200)); // 让 React 渲染 + 数据加载
      await page.screenshot({ path: out, fullPage: false });
      const sz = fs.statSync(out).size;
      console.log(`     OK (${sz} bytes)`);
    } catch (e) {
      console.error(`     FAIL: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
