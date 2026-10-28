# spec · v1-2 合规加固（web 同构，部分）

- **status**: draft
- **date**: 2026-07-30
- **关联**: `gift-pilot-miniprogram` 同 feature 的 F2 类型同构部分

## 背景
Web 仓（`gift-pilot-web`）与小程序存在同样的 `ProviderCallResult` 类型分裂：
`utils/trace.ts` 与 `types/index.ts` 均用 `trace_id`，而小程序 `platform/adapter.ts` 用 `traceId`。
Web 无 `platform/adapter`、无支付模块，故本次仅做 **类型同构**（对齐 `traceId`），
F1/F3/F4/F5（支付相关）在 web 不适用，记为 gap。

## 范围
- 改：`src/types/index.ts`、`src/utils/trace.ts`
- 不改：任何真实支付 / LLM 接入

## 目标
`ProviderCallResult<T>` 在 web 也以 `traceId`（+`cost?`）为唯一字段名，与 `@rockcent/platform/ai` 对齐，
避免阶段三切换真实 Provider 时类型错配。
