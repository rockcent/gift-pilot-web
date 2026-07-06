# Web MVP · 礼有方网页端 · 技术方案

**对应规格**：`.specify/features/web-mvp/spec.md`
**对应宪法**：`.specify/constitution.md` v0.2
**最后更新**：2026-07-06

---

## 1. 技术栈选型

| 维度 | 选型 | 理由 |
|---|---|---|
| 构建 | **Vite 5** | 快、TS 一等公民；rockcent-platform 默认 Vite |
| 框架 | **React 18 + TypeScript 5** | 与小程序端一致 |
| 路由 | **react-router-dom 6** | 标准 SPA 多路由方案 |
| 状态 | **Zustand 4** | 与小程序端一致 |
| 样式 | **CSS Modules + SCSS** | 视觉 token 用全局 SCSS，组件用 CSS Modules |
| UI | **自研 + `@rockcent/platform/ui`**（阶段二起） | 复用 rockcent-platform/ui 按钮 / 卡片 / 表格 |
| 数据请求 | **`@rockcent/platform/web-client`** | 平台统一 API 客户端 |
| AI | **`@rockcent/platform/ai` + `@rockcent/platform/ai-gateway`** | 真实 LLM 接入形态 |
| 图表 | **自研 SVG**（仪表盘 / 财务趋势图） | MVP 阶段不引图表库 |
| 包管理 | **pnpm** | 与平台一致 |
| 测试 | **Jest + @testing-library/react** | 与平台一致 |

## 2. 平台接入

```json
{
  "dependencies": {
    "@rockcent/platform": "git+https://github.com/rockcent/rockcent-platform.git#platform-v1.15.2"
  }
}
```

## 3. 目录结构

```
gift-pilot-web/
├── .specify/                         # SDD 规范
├── src/
│   ├── main.tsx                      # Vite 入口
│   ├── App.tsx                       # 路由根
│   ├── router.tsx                    # 路由表（用户 / admin）
│   ├── layout/
│   │   ├── UserLayout.tsx            # C 端用户布局（顶部导航 + 底部 footer）
│   │   └── AdminLayout.tsx           # 管理后台布局（侧边栏 + 顶部 bar）
│   ├── pages/
│   │   ├── user/                     # C 端 10 页面
│   │   │   ├── HomePage.tsx          # / 表达需求
│   │   │   ├── RecommendPage.tsx     # /recommend
│   │   │   ├── ContentPage.tsx       # /content
│   │   │   ├── CoverPage.tsx         # /cover
│   │   │   ├── PublishConfirmPage.tsx
│   │   │   ├── PublishSuccessPage.tsx
│   │   │   ├── OrdersPage.tsx        # /orders
│   │   │   ├── ReviewPage.tsx        # /review
│   │   │   ├── NextPlanPage.tsx      # /next-plan
│   │   │   └── MemoryPage.tsx        # /memory
│   │   └── admin/                    # 管理后台 8 页面
│   │       ├── LoginPage.tsx         # /admin/login
│   │       ├── DashboardPage.tsx     # /admin
│   │       ├── GiftsPage.tsx         # /admin/gifts
│   │       ├── OrdersPage.tsx        # /admin/orders
│   │       ├── UsersPage.tsx         # /admin/users
│   │       ├── ContentReviewPage.tsx # /admin/content
│   │       ├── MemoryAuditPage.tsx   # /admin/memory
│   │       └── FinancePage.tsx       # /admin/finance
│   ├── components/
│   │   ├── user/                     # 复用小程序组件的 web 版（同样 props）
│   │   └── admin/                    # 后台专用：DataTable / MetricCard / Drawer / FilterBar
│   ├── stores/                       # 与小程序端同样的 Zustand stores
│   ├── services/                     # 与小程序端同样的 mock service
│   ├── types/                        # 复用小程序的 src/types（手动同步）
│   ├── data/                         # 复用小程序的 src/data（手动同步）
│   ├── styles/
│   │   ├── tokens.scss               # 与小程序一致的视觉 token
│   │   ├── global.scss
│   │   └── admin.scss                # 管理后台专用样式（侧边栏 / 表格）
│   ├── guards/
│   │   └── AdminAuthGuard.tsx        # admin 路由鉴权中间件
│   ├── audit/
│   │   └── audit-log.ts              # admin 写操作审计日志
│   └── utils/                        # money / id / trace（同小程序）
├── __tests__/
├── scripts/
│   ├── smoke-web.mjs                 # web smoke：路由 / 平台 pin / 整数金额 / admin 路由
│   ├── check-platform-deps-local.mjs
│   └── check-no-sensitive.mjs
├── .github/workflows/ci.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
└── CHANGELOG.md
```

## 4. 路由表（router.tsx）

```ts
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  // C 端用户
  { path: '/', element: <UserLayout />, children: [
    { index: true, element: <HomePage /> },
    { path: 'recommend', element: <RecommendPage /> },
    { path: 'content', element: <ContentPage /> },
    { path: 'cover', element: <CoverPage /> },
    { path: 'publish-confirm', element: <PublishConfirmPage /> },
    { path: 'publish-success', element: <PublishSuccessPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'review', element: <ReviewPage /> },
    { path: 'next-plan', element: <NextPlanPage /> },
    { path: 'memory', element: <MemoryPage /> }
  ]},
  // 管理后台
  { path: '/admin/login', element: <LoginPage /> },
  { path: '/admin', element: <AdminAuthGuard><AdminLayout /></AdminAuthGuard>, children: [
    { index: true, element: <DashboardPage /> },
    { path: 'gifts', element: <GiftsPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'content', element: <ContentReviewPage /> },
    { path: 'memory', element: <MemoryAuditPage /> },
    { path: 'finance', element: <FinancePage /> }
  ]}
]);
```

## 5. 跨端复用

- `src/types/index.ts` 字段名完全同 `gift-pilot-miniprogram/src/types/index.ts`；
- `src/data/mock-*.json` 直接同步自小程序的 mock 文件；
- `src/services/*/mock.ts` 复用同样接口；
- `src/stores/*` Zustand store 完全同名同形态。

阶段二起抽到 `gift-pilot-shared` npm 包，两端 install 同一份。

## 6. 管理后台鉴权（MVP）

```ts
// src/guards/AdminAuthGuard.tsx
export function AdminAuthGuard({ children }) {
  const session = localStorage.getItem('gp-admin-session');
  const location = useLocation();
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
```

MVP 阶段密码在 `.env.example` 占位 `VITE_ADMIN_PASSWORD=admin123`；登录态存 `localStorage.gp-admin-session`。

## 7. 视觉系统落地

`src/styles/tokens.scss` 与小程序一致：

```scss
:root {
  --brand-green: #23B26D;
  --brand-apricot: #F6C98D;
  --brand-coral: #F47C6C;
  --brand-bg: #FAF9F6;
  --brand-ink: #1F2933;
  --brand-muted: #6B7280;
  --radius-card: 16px;
  --radius-pill: 999px;
  --shadow-card: 0 4px 16px rgba(31, 41, 51, 0.06);
}
```

## 8. 响应式

```scss
// 断点
$bp-tablet: 768px;
$bp-desktop: 1024px;

// C 端用户布局
.user-layout {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  @media (min-width: $bp-desktop) {
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
}
```

## 9. 操作日志（MVP mock）

admin 写操作（订单状态调整 / 礼物上下架 / 内容打回 / 提现处理）记录到 `localStorage.gp-admin-audit`，阶段二切云数据库：

```ts
export function writeAudit(entry: { action: string; target: string; operator: string; ts: number; meta?: any }) {
  const list = JSON.parse(localStorage.getItem('gp-admin-audit') ?? '[]');
  list.push(entry);
  localStorage.setItem('gp-admin-audit', JSON.stringify(list.slice(-500))); // 保留最近 500 条
}
```

## 10. CI / Smoke

`scripts/smoke-web.mjs` 检查：
- 平台 pin ��确；
- 金额整数；
- 无敏感信息；
- 10 个 C 端路由入口文件齐全；
- 8 个 admin 路由入口文件齐全；
- admin 路由全部在 `AdminAuthGuard` 之下；
- 视觉 token 4 色全字段存在。

## 11. 风险与回滚

- Vite + react-router 多路由：阶段二可拆分为 `gift-pilot-user` + `gift-pilot-admin` 两个独立 deploy unit，减小包体；
- 单一 admin 密码：阶段二接 OAuth / SAML；
- mock 数据与小程序同步：阶段二抽 shared 包，自动化 sync。
