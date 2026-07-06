# Web MVP · 任务清单

**对应方案**：`.specify/features/web-mvp/plan.md`
**编排原则**：脚手架 → 数据层 → C 端组件 → C 端页面 → admin 鉴权 → admin 组件 → admin 页面 → 验证 → CI。
**协作分工**：Codex（架构 / 跨端复用 / admin 红线 / 评审 / merge） + claudecode（🤖CC 标记的单页面 / 表格 / 单测）。
**最后更新**：2026-07-06

---

## 阶段 0：脚手架（Codex）

- [ ] **T-W001** Vite 5 + React 18 + TS 5 工程初始化，`package.json` / `tsconfig.json` / `vite.config.ts`
- [ ] **T-W002** 接入 `@rockcent/platform` pin（与小程序同 tag）
- [ ] **T-W003** `react-router-dom` 路由表（`router.tsx`）
- [ ] **T-W004** `src/styles/{tokens,global,admin}.scss`（视觉 token + 后台样式）
- [ ] **T-W005** `.env.example` + `.gitignore` + `index.html`

## 阶段 1：数据层（Codex）

- [ ] **T-W010** 同步小程序端 `types/index.ts` + `utils/{money,id,trace}.ts`
- [ ] **T-W011** 同步小程序端 `data/mock-*.json`
- [ ] **T-W012** 同步小程序端 `services/{api, ai/mock, orders/mock, memory/mock}.ts`
- [ ] **T-W013** 同步小程序端 `stores/{ai,orders,memory}-store.ts`

## 阶段 2：C 端组件层（🤖CC 可领）

- [ ] **T-W020** 🤖CC `components/user/{Brand,TopNav,AISixBanner}.tsx`
- [ ] **T-W021** 🤖CC `components/user/{ChatBubble,ChatInput}.tsx`
- [ ] **T-W022** 🤖CC `components/user/{GiftCard,ContentCard,CoverCard}.tsx`
- [ ] **T-W023** 🤖CC `components/user/{MetricCard,PlanRow,AIMemoryRow}.tsx`

## 阶段 3：C 端页面层（Codex 主导）

- [ ] **T-W030** `layout/UserLayout.tsx`（顶部导航 + footer）
- [ ] **T-W031** `pages/user/HomePage.tsx`
- [ ] **T-W032** `pages/user/RecommendPage.tsx`
- [ ] **T-W033** `pages/user/ContentPage.tsx`
- [ ] **T-W034** `pages/user/CoverPage.tsx`
- [ ] **T-W035** `pages/user/PublishConfirmPage.tsx`
- [ ] **T-W036** `pages/user/PublishSuccessPage.tsx`
- [ ] **T-W037** `pages/user/OrdersPage.tsx`
- [ ] **T-W038** `pages/user/ReviewPage.tsx`
- [ ] **T-W039** `pages/user/NextPlanPage.tsx`
- [ ] **T-W040** `pages/user/MemoryPage.tsx`

## 阶段 4：admin 鉴权 + 守卫（Codex）

- [ ] **T-W050** `src/audit/audit-log.ts`（写操作日志）
- [ ] **T-W051** `src/guards/AdminAuthGuard.tsx`（路由中间件）
- [ ] **T-W052** `pages/admin/LoginPage.tsx`
- [ ] **T-W053** `layout/AdminLayout.tsx`（侧边栏 + 顶部 bar）

## 阶段 5：admin 组件层（🤖CC 可领）

- [ ] **T-W060** 🤖CC `components/admin/DataTable.tsx`（分页 + 列定义 + 行操作）
- [ ] **T-W061** 🤖CC `components/admin/Drawer.tsx`（详情抽屉）
- [ ] **T-W062** 🤖CC `components/admin/FilterBar.tsx`（多条件筛选）
- [ ] **T-W063** 🤖CC `components/admin/MetricCard.tsx`（大号指标卡）
- [ ] **T-W064** 🤖CC `components/admin/TrendChart.tsx`（SVG 折线图）
- [ ] **T-W065** 🤖CC `components/admin/BarChart.tsx`（SVG 横向柱状图）

## 阶段 6：admin 页面层（Codex 主导）

- [ ] **T-W070** `pages/admin/DashboardPage.tsx`
- [ ] **T-W071** `pages/admin/GiftsPage.tsx`（CRUD + 上下架）
- [ ] **T-W072** `pages/admin/OrdersPage.tsx`（查询 + 状态调整 + 审计）
- [ ] **T-W073** `pages/admin/UsersPage.tsx`（列表 + AI 记忆只读抽屉）
- [ ] **T-W074** `pages/admin/ContentReviewPage.tsx`（通过 / 打回）
- [ ] **T-W075** `pages/admin/MemoryAuditPage.tsx`（异常记忆标记 + **不可编辑**）
- [ ] **T-W076** `pages/admin/FinancePage.tsx`（佣金趋势 + 提现处理）

## 阶段 7：测试（Codex + 🤖CC）

- [ ] **T-W090** 单测：`utils/money` / `utils/id` / `stores/*`
- [ ] **T-W091** 单测：`guards/AdminAuthGuard`（未登录重定向 / 已登录通过）
- [ ] **T-W092** 单测：`audit/audit-log`（写 + 读 + 500 条上限）

## 阶段 8：CI / 文档（Codex）

- [ ] **T-W100** `.github/workflows/ci.yml`
- [ ] **T-W101** `README.md`（含跨端复用说明）
- [ ] **T-W102** `CHANGELOG.md` v0.6.0-web-mvp
- [ ] **T-W103** 本仓加入 `.specify/features/web-mvp/` 索引到 `/Volumes/Rock2/codex/cloud-server-ops/CURRENT_WORK.md`

## 阶段 9：交付（Codex）

- [ ] **T-W110** `pnpm run lint` ✅
- [ ] **T-W111** `pnpm run build` ✅
- [ ] **T-W112** `pnpm run smoke:web` ✅
- [ ] **T-W113** git commit + 可选 push

---

## 状态

- 当前阶段：**阶段 0 启动中**。
- 已完成：`constitution.md` v0.2 / `spec.md` / `plan.md` / `tasks.md`。
- 待 PM 拍板：是否同意 Vite + 多路由 + admin MVP 范围（CRUD + 仪表盘 + 审计）。

## 与本地 claudecode 协作

- 🤖CC 任务粒度：单组件 / 单页面 / 单测，禁止跨文件改动；
- Codex 主导：跨端同步 / admin 鉴权 / admin 红线 / 架构决策 / 评审。
