# Plan: v1.3 微信支付 JSAPI 接入（web 仓）

## 架构
- 新增 `src/services/payment/types.ts`：`PaymentProvider` 接口（与小程序仓同构）。
- `src/services/payment/mock.ts`：mock 实现，落地 §4 不变量（web 首次）。
- `src/services/payment/wechat.ts`：
  - 微信内：`@rockcent/platform` 代理下单（带 openid）→ `WeixinJSBridge.invoke('getBrandWCPayRequest', {...})`（或微信 JS-SDK `wx.chooseWXPay`）。
  - 站外：`@rockcent/platform` 代理下单 → `window.location.href = mweb_url`。
- `src/services/payment/index.ts`：`VITE_PAYMENT_MODE` 切换 + 无凭证守卫。
- openid 获取：微信内走服务号网页授权（OAuth），`@rockcent/platform/web-client` 提供 `getOpenId(code)`；授权回调在平台侧配置。
- 下单入口：视产品漏斗，在 web 送礼 CTA 处接入（与小程序 `pages/checkout` 对应）。

## 文件清单
- 新增：`src/services/payment/{types,mock,wechat,index}.ts`
- 改：`src/utils/trace.ts`（v1.2 已统一 `traceId`）、`src/types/index.ts`（v1.2 已统一 `ProviderCallResult`）
- 文档：本 `.specify`、README 同步

## 环境判断
- `/(MicroMessenger)/i.test(navigator.userAgent)` → 微信内 → JSAPI；否则 → H5。

## 风险
- 强依赖 `@rockcent/platform` 支付代理 + 服务号网页授权就绪。
- JSAPI 需 JS-SDK `wx.config` 签名（后端），前端仅调起。
- 回调解密需后端。
