# tasks · v1-2 合规加固（web）

- [ ] T1 `src/types/index.ts`：`ProviderCallResult<T>` 字段 `trace_id → traceId`，增加 `cost?`
- [ ] T2 `src/utils/trace.ts`：`okResult/errResult` 返回 `traceId`（原为 `trace_id`）
- [ ] T3 本地复核：`pnpm test`（web 当前 admin/订单页零单测，需先确认类型编译通过）
- [ ] GAP `wechat-pay` / 订单金额一致性 / 幂等 / 退款终态：web 无支付模块，列为阶段三 feature
