# Changelog

## v0.6.0-web-mvp · 2026-07-06

礼有方网页端 MVP v0.6 首发。一个仓同时承载 C 端用户界面与 B 端管理后台。

### Features
- C 端 10 个页面（与小程序 1:1）
- B 端 8 个页面（仪表盘 / 商品 / 订单 / 用户 / 内容 / 记忆 / 财务）
- 6 个 admin 组件（DataTable / Drawer / AdminMetricCard / TrendChart / BarChart / FilterBar）
- 7 个 user 组件（Brand / AISixBanner / GiftCard / ContentCard / MetricCard / PlanRow / AIMemoryRow / ChatBubble）
- 管理后台鉴权中间件（AdminAuthGuard）
- 操作审计日志（writeAudit / readAudit / 500 条 FIFO）

### Engineering
- Vite 5 + React 18 + TS 5 + react-router-dom 6
- 平台 pin：@rockcent/platform#platform-v1.15.2
- 数据层 / 服务层 / store 与小程序端字段完全一致
- 12 项 smoke 全过：平台 pin / 整数金额 / 敏感扫描 / 10 路由 / 8 admin 路由 / 鉴权 / 视觉 4 色 / 6 AI 标签 / §6.8 红线
- 6 个 jest 单测文件 + 14 测试用例
- GitHub Actions 最小 CI

### Documentation
- `.specify/constitution.md` v0.2（多端分工）
- `.specify/features/web-mvp/{spec,plan,tasks}.md`

### Out of scope（阶段二起）
- 真实 LLM / 真实支付 / 真实商品 API
- OAuth / SAML
- 礼有方 Pro / 礼有方云 / 开放平台
