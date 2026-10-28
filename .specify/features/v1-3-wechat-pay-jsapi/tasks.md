# Tasks: v1.3 微信支付 JSAPI 接入（web 仓）

- [ ] T1 新增 `src/services/payment/types.ts`：`PaymentProvider` 接口（沿用小程序仓同构）
- [ ] T2 `src/services/payment/mock.ts`：mock 实现，落地 §4 不变量（web 首次）
- [ ] T3 `src/services/payment/wechat.ts`：JSAPI（微信内 `WeixinJSBridge`/`wx.chooseWXPay`）+ H5（`mweb_url`），经 `@rockcent/platform` 代理；无凭证抛错
- [ ] T4 `src/services/payment/index.ts`：`VITE_PAYMENT_MODE` 切换 + 守卫
- [ ] T5 openid 获取：微信内走服务号网页授权（`@rockcent/platform` 提供）
- [ ] T6 微信内/站外自动切换 JSAPI/H5（UA 判断）
- [ ] T7 下单入口接线：`price_fen` → `assertOrderAmountMatch`（需从小程序仓同步 `assertOrderAmountMatch` 工具）→ `pay` → 落库
- [ ] T8 集成测试：mock 全链路、金额不一致被拒、退款终态 REFUNDED、归因落库、幂等去重
- [ ] T9 README / `.specify` 同步（§7.1）

## 前置闸门（实现真实分支前必须）
- [ ] PM 提供服务号 + 微信支付商户号 + 网页授权回调域名
- [ ] `@rockcent/platform` 支付代理 + 网页授权就绪
- [ ] 法务签字（§6）
- [ ] 本地 `pnpm test` 绿灯
