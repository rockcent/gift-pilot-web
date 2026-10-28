# Feature Spec: v1.3 微信支付 JSAPI 接入（web 仓）

> 仓库：gift-pilot-web（React 18 + Vite，域名 gift.rockcent.com）
> 承接：v1.2 合规加固（F2 `ProviderCallResult` 单一真源）；本仓**原无支付模块**，F1/F3/F4/F5 此前为 gap
> 宪法：§4 支付不变量 / §6 隐私 / §7 SDD / §8 mock 豁免止于真实接入

## 1. 背景
web 仓当前无任何支付模块（v1.2 的 F1/F3/F4/F5 仅在小程序仓落地，web 记为 gap）。当用户在**微信内**打开 `gift.rockcent.com` 时，应使用**微信 JSAPI 支付**；在站外浏览器打开则用 **H5 支付**兜底。本 feature 为 web 补齐支付能力，并与小程序仓共享同一套 §4 不变量。

## 2. 目标
1. 新增 `services/payment/*`（与小程序仓同构）：`PaymentProvider` 抽象 + mock + 真实 JSAPI/H5。
2. web 在微信内：服务号网页授权（OAuth snsapi_base）取 openid → JSAPI 支付（`WeixinJSBridge.invoke('getBrandWCPayRequest')`）。
3. web 在站外：H5 支付（`mweb_url` 跳转）。
4. 复用 §4 不变量（金额一致性 / 退款终态 / 归因 / 幂等）—— 在 web 首次真正落地。

## 3. 范围
- **In**：payment 模块、JSAPI（微信内）/ H5（站外）切换、金额/归因/幂等/退款终态接线、下单页或 CTA。
- **Out**：微信小店商品库、视频号种草、企微 B 端、真实 LLM（独立 feature）。当前 web 的「送礼」业务入口本 feature 仅做支付接线，业务漏斗由产品确认。

## 4. 约束 / 闸门（硬性）
- 真实支付需 **服务号 + 微信支付商户号 + 网页授权回调域名** 配置，且经 `@rockcent/platform` 后端代理（前端不持密钥）。
- 触发 `SECURITY_AND_PAYMENT_GATE.md`；§4 不变量硬约束。
- 平台 pin 维持 `platform-v1.20.0`。
- 实施前 `pnpm test` 绿（沙箱无法跑，需本地）。
- 未拿凭证前仅实现抽象 + mock 可跑，真实分支留 TODO + 守卫。

## 5. 不变量（与小程序仓一致）
- §4.1 整数分；§4.2 `completeRefund → REFUNDED`；§4.3 `assertOrderAmountMatch`；§4.5 `content_id`+`recommendation_id`；幂等 `idempotencyKey`。

## 6. 验收
- mock 模式：web 下单 → 支付（mock）→ 订单落库，全链路可跑。
- 金额不一致被拒、退款终态 REFUNDED、归因落库、幂等去重 有测试。
- 微信内/站外自动切换 JSAPI/H5；无凭证时真实分支显式失败。
