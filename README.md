# 礼有方（GiftPilot）网页端

> AI 礼物经营助手 · 一个仓同时承载 C 端用户界面与 B 端管理后台

![status](https://img.shields.io/badge/version-v0.6.0--web--mvp-blue)
![platform](https://img.shields.io/badge/platform-rockcent--v1.15.2-green)
![node](https://img.shields.io/badge/node-%3E%3D20-blue)

## 简介

把小程序端的 10 步 C 端用户体验**完整搬运**到网页端（H5 / PC 自适应），并在 `/admin/*` 子路由下新增**最小可用的平台管理后台**。

```
/                   → C 端用户首页（表达需求）
/recommend          → AI 选品推荐
/content            → 内容生成
/cover              → 封面设计
/publish-confirm    → 发布确认
/publish-success    → 发布成功
/orders             → 订单与佣金
/review             → 经营复盘
/next-plan          → AI 下一步计划
/memory             → 我的 AI 记忆
/admin/login        → 管理后台登录
/admin              → 仪表盘
/admin/gifts        → 商品管理
/admin/orders       → 订单管理
/admin/users        → 用户管理
/admin/content      → 内容审核
/admin/memory       → AI 记忆审核（不可编辑，宪法 §6.8 红线）
/admin/finance      → 财务概览
```

## 技术栈

| 维度 | 选型 |
|---|---|
| 构建 | Vite 5 |
| 框架 | React 18 + TypeScript 5 |
| 路由 | react-router-dom 6 |
| 状态 | Zustand 4 |
| 样式 | CSS Modules + SCSS（视觉 token） |
| 平��� | `@rockcent/platform`（pinned `git+https://...#platform-v1.15.2`） |
| 包管理 | pnpm |

## 启动

```bash
pnpm install --frozen-lockfile
pnpm run dev                   # http://localhost:5173
pnpm run build                 # 输出到 dist/
pnpm run test                  # 跑 jest
pnpm run smoke:web             # 跑 smoke（无需安装依赖）
pnpm run check:platform-deps   # 平台 pin 检查
pnpm run check:no-sensitive    # 敏感信息扫描

# 部署到 aliyun-rockcent-prod（详见 cloud-server-ops/runbooks/giftpilot-web-deploy.md）
pnpm run deploy:preflight      # 部署前 8 项检查
pnpm run deploy:dry-run        # 看 rsync 计划，不实际改
pnpm run deploy:production     # 真实部署（PM Mac 终端跑，沙箱拦 SSH）
```

## 管理后台登录

MVP 阶段：单一密码 `admin123`（.env.example 占位）。
阶段二起：接 OAuth / SAML。

## 与小程序端的关系

`src/types / data / services / stores / utils` 与 `gift-pilot-miniprogram` **保持接口形态 1:1**：
- 字段名一致；
- mock 数据内容一致；
- 接口形态一致。

阶段二起抽到 `gift-pilot-shared` npm 包，两端 install 同一份。

## 平台合规

- `@rockcent/platform` 锁定 `git+https://github.com/rockcent/rockcent-platform.git#platform-v1.15.2`，**禁止** `github:` / `git+ssh:` / `file:`
- 金额统一用「分」整数
- 订单状态机 CREATED / PAID / CLOSED 三态
- AI 记忆属于用户私有，admin **不可编辑**（宪法 §6.8 红线 + MemoryAuditPage UI 强制提示）
- 管理后台写操作（订单状态 / 礼物上下架 / 内容审核 / 提现处理 / 记忆标记）记录到 localStorage `gp-admin-audit`（阶段二切云数据库）

## 与本地 Claude Code 协作

- 单组件 / 单页面 / 单测改动 → 可派给本地 `claude -p --permission-mode dontAsk`
- 跨文件架构 / 平台 pin / admin 鉴权 / 宪法红线 → Codex 主导
- admin 鉴权 / 宪法红线改动 → 必走 SDD 评审


## 部署（aliyun-rockcent-prod）

| 项 | 值 |
|---|---|
| 域名 | `https://gift.rockcent.com/` |
| 静态目录 | `/usr/share/nginx/giftpilot/dist/` |
| Nginx 配置 | `/etc/nginx/conf.d/gift.rockcent.com.conf` |
| 部署脚本 | `scripts/deploy-production.sh` |
| Runbook | `cloud-server-ops/runbooks/giftpilot-web-deploy.md` |

首次部署需先 `certbot --webroot` 领取 LE 证书（详见 runbook Step 0-3），之后 `npm run deploy:production` 即可一键更新。
