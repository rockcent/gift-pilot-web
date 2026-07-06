#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const errs = [];
const oks = [];

function ok(label) { oks.push(label); }
function bad(label) { errs.push(label); }

/* 1. 平台 pin */
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const platformDep =
  pkg.dependencies?.['@rockcent/platform'] ??
  pkg.optionalDependencies?.['@rockcent/platform'];
if (platformDep?.startsWith('git+https://github.com/rockcent/rockcent-platform.git#platform-v')) ok('platform pin');
else bad('platform pin missing or wrong form: ' + platformDep);

const forbidden = ['github:rockcent/rockcent-platform', 'git+ssh://', 'file:/Volumes/Rock2/rockcent-platform'];
const raw = JSON.stringify(pkg);
for (const f of forbidden) if (raw.includes(f)) bad('forbidden platform dep form: ' + f);
if (!errs.some((e) => e.startsWith('forbidden'))) ok('no forbidden platform dep form');

/* 2. 整数金额 */
function walk(dir, cb) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, cb);
    else if (st.isFile()) cb(p);
  }
}
let n = 0;
walk(path.join(ROOT, 'src'), (p) => {
  if (!/\.(ts|tsx)$/.test(p)) return;
  n += 1;
  const body = fs.readFileSync(p, 'utf8');
  const exprs = body.match(/_fen\s*[:=]\s*[^,\n}\)]+/g) || [];
  for (const expr of exprs) {
    const rhs = expr.split(/[:=]/)[1]?.trim() || '';
    if (/^-?\d+\.\d+$/.test(rhs)) bad('non-integer _fen in ' + path.relative(ROOT, p) + ': ' + expr);
  }
});
if (!errs.some((e) => e.startsWith('non-integer'))) ok(`scanned ${n} ts/tsx; all _fen are integers`);

/* 3. 敏感文件 */
for (const f of ['.env', 'project.config.json']) {
  if (fs.existsSync(path.join(ROOT, f))) bad('sensitive file tracked: ' + f);
}
if (!errs.some((e) => e.startsWith('sensitive'))) ok('no tracked sensitive files');

/* 4. C 端 10 个路由入口 */
const userPages = [
  'src/pages/user/HomePage.tsx',
  'src/pages/user/RecommendPage.tsx',
  'src/pages/user/ContentPage.tsx',
  'src/pages/user/CoverPage.tsx',
  'src/pages/user/PublishConfirmPage.tsx',
  'src/pages/user/PublishSuccessPage.tsx',
  'src/pages/user/OrdersPage.tsx',
  'src/pages/user/ReviewPage.tsx',
  'src/pages/user/NextPlanPage.tsx',
  'src/pages/user/MemoryPage.tsx'
];
for (const p of userPages) if (!fs.existsSync(path.join(ROOT, p))) bad('missing user page: ' + p);
if (!errs.some((e) => e.startsWith('missing user'))) ok('all 10 user pages present');

/* 5. admin 8 路由入口 */
const adminPages = [
  'src/pages/admin/LoginPage.tsx',
  'src/pages/admin/DashboardPage.tsx',
  'src/pages/admin/GiftsPage.tsx',
  'src/pages/admin/OrdersPage.tsx',
  'src/pages/admin/UsersPage.tsx',
  'src/pages/admin/ContentReviewPage.tsx',
  'src/pages/admin/MemoryAuditPage.tsx',
  'src/pages/admin/FinancePage.tsx'
];
for (const p of adminPages) if (!fs.existsSync(path.join(ROOT, p))) bad('missing admin page: ' + p);
if (!errs.some((e) => e.startsWith('missing admin'))) ok('all 8 admin pages present');

/* 6. admin 鉴权 */
if (!fs.existsSync(path.join(ROOT, 'src/guards/AdminAuthGuard.tsx'))) bad('AdminAuthGuard missing');
else ok('AdminAuthGuard present');

const routerBody = fs.readFileSync(path.join(ROOT, 'src/router.tsx'), 'utf8');
const adminRoutes = ['/admin/login', '/admin']; const adminSubRoutes = ['gifts', 'orders', 'users', 'content', 'memory', 'finance'];
for (const r of adminRoutes) if (!routerBody.includes(`path: '${r}'`)) bad('admin route missing: ' + r);
if (!errs.some((e) => e.startsWith('admin route'))) ok('all 7 admin routes declared');

if (!routerBody.includes('AdminAuthGuard')) bad('AdminAuthGuard not used in router');
else ok('AdminAuthGuard wraps admin routes');

/* 7. 视觉 token 4 色 */
const tokensBody = fs.readFileSync(path.join(ROOT, 'src/styles/tokens.scss'), 'utf8');
const colors = ['#23B26D', '#F6C98D', '#F47C6C', '#FAF9F6'];
for (const c of colors) if (!tokensBody.includes(c)) bad('token color missing: ' + c);
if (!errs.some((e) => e.startsWith('token'))) ok('4 visual token colors present');

/* 8. 6 大 AI 标签 */
const bannerBody = fs.readFileSync(path.join(ROOT, 'src/components/user/AISixBanner.tsx'), 'utf8');
const sixLabels = ['选对礼', '谈得好', '做得美', '发得准', '看得清', '改得好'];
for (const l of sixLabels) if (!bannerBody.includes(l)) bad('AI 6 banner missing label: ' + l);
if (!errs.some((e) => e.startsWith('AI 6 banner'))) ok('AI 6 labels present');

/* 9. 宪法红线：MemoryAuditPage 必须显示「不可编辑」提示 */
const memoryAuditBody = fs.readFileSync(path.join(ROOT, 'src/pages/admin/MemoryAuditPage.tsx'), 'utf8');
if (!memoryAuditBody.includes('admin 不可修改')) bad('MemoryAuditPage must warn about admin edit prohibition (宪法 §6.8)');
else ok('MemoryAuditPage enforces §6.8 admin edit prohibition');

console.log('=== Smoke: gift-pilot-web ===');
for (const o of oks) console.log('  OK ' + o);
if (errs.length) {
  for (const e of errs) console.log('  FAIL ' + e);
  process.exit(1);
}
console.log('All checks PASSED.');
