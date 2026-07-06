# 礼有方（GiftPilot）项目宪法

**版本：v0.2 · 2026-07-06 起生效 · 与 rockcent-platform v2.x 宪法平行**

本文是礼有方所有代码仓（小程序 / 网页用户端 / 网页管理后台）的最高层不变量。
spec / plan / tasks / code 不得与本宪法矛盾。

---

## §1 品牌与心智（同 gift-pilot-miniprogram §1）

1.1 品牌名：中文「礼有方」；英文辅助名「GiftPilot」。
1.2 AI 角色：「小礼」。
1.3 品类定位：「AI 礼物经营助手」。
1.4 主口号：「送礼有方，推荐有数。」
1.5 小礼人格：聪明、温暖、得体、可信、克制、有审美、有商业头脑。
1.6 禁止人格：微商式叫卖、夸张收益承诺、冰冷机器人、堆形容词、高高在上的礼仪专家、没有数据依据的顾问。

## §2 视觉规范（Visual Tokens）

| Token | 值 | 用途 |
|---|---|---|
| `--brand-green` | `#23B26D` 策绿 | 主色 |
| `--brand-apricot` | `#F6C98D` 礼杏 | 辅助色 |
| `--brand-coral` | `#F47C6C` 心意珊瑚 | 礼物角标 / 成功状态 |
| `--brand-bg` | `#FAF9F6` 暖白 | 全局背景 |
| `--brand-ink` | `#1F2933` | 主文字 |
| `--brand-muted` | `#6B7280` | 辅助文字 |

**禁止**：大红大金的微商风、过度蓝紫的冷科技风、复杂拟物、高密度金融数据感。

## §3 业务范围与代码仓结构

3.1 **多端分工**（用户原话）：
   - **网页端** = `gift-pilot-web`：单一仓同时承载 C 端用户界面与 B 端平台管理后台。
     - `/` 起为 C 端用户界面路由（首页 / 选品 / 内容 / 发布 / 订单 / 复盘 / 记忆 等）；
     - `/admin/*` 为 B 端管理后台路由（登录 / 仪表盘 / 商品 / 订单 / 用户 / 内容 / AI 记忆 / 财务）。
   - **小程序端** = `gift-pilot-miniprogram`：仅承载 C 端用户界面，与 web 用户界面共用一套 `stores / services / data / types`。

3.2 **C 端用户界面 10 步链路**（两端一致）：表达需求 → AI 选品推荐 → 内容生成 → 封面设计 → 发布确认 → 发布成功 → 订单佣金 → 经营复盘 → AI 下一步 → 我的 AI 记忆。

3.3 **B 端管理后台 MVP 范围**（v0.6 起）：
   - 仪表盘：关键指标（DAU / 发布数 / 订单数 / GMV / 佣金总额 / 复盘触发率）；
   - 商品管理：礼物库 CRUD（与小程序的 mock-gifts.json 同源）；
   - 订单管理：订单查询 + 状态调整（仅 mock 阶段，阶段二接支付后限权）；
   - 用户管理：用户列表 + AI 记忆查看/编辑；
   - 内容审核：小礼生成内容的人工抽检入口（MVP 阶段只读）；
   - AI 记忆审核：异常记忆审计（异常预算 / 异常商品类目）；
   - 财务概览：佣金趋势 + 提现申请（MVP 阶段 mock）。

3.4 **不在 MVP 范围**：
   - 礼有方 Pro / 礼有方云 / 礼有方开放平台；
   - 真实支付接入 / 真实 LLM / 真实商品 API（同 §8.2 豁免）；
   - 多租户 / 子账号 / RBAC（MVP 用单一 admin 账号）。

## §4 数据不变量（Data Invariants）

4.1 **金额**：内部统一用「分」整数（`amount_fen: number`）。**禁止**浮点数。
4.2 **订单状态机**：`CREATED → PENDING → PAID → CLOSED / REFUNDING → REFUNDED / FAILED`。MVP 实现 `CREATED / PAID / CLOSED`。
4.3 **订单金额一致性**：订单创建金额 = 推荐快照展示金额，差额 > 0 视为失败。
4.4 **推荐快照**：AI 选品必须保存不可变快照。
4.5 **发布归因**：订单必须可追溯到某条发布和某个推荐。
4.6 **用户偏好隐私**：AI 记忆属于用户私有，**禁止**跨用户共享，**禁止**上传训练。

## §5 AI 不变量

5.1 小礼不油腻；禁止「精准推荐」「大数据智能」等空泛话术。
5.2 可解释；推荐必给理由。
5.3 记忆可控；用户一键清空。
5.4 风险主动；预算超 / 关系不当时主动提醒。
5.5 不要承诺收益；禁止「保证出单」「月入过万」。

## §6 工程不变量

6.1 **平台复用**：所有仓**必须**通过 `git+https://github.com/rockcent/rockcent-platform.git#platform-vX.Y.Z` 接入 `@rockcent/platform`。**禁止** `github:` / `git+ssh:` / `file:`。

6.2 **跨端复用**：
   - `src/types/` 与 `src/data/mock-*.json` 在两个仓之间保持同步（手动 sync，阶段二起抽到 `gift-pilot-shared` 包）；
   - `src/services/ai/` 与 `src/stores/` 在两个仓间用同样的接口形态，便于后续抽包；
   - 视觉 token（§2）两端**完全一致**。

6.3 **包管理器**：推荐 pnpm；回退 npm；**禁止** yarn。

6.4 **技术栈**：
   - 小程序端：Taro 3.6 + React 18 + TS 5；
   - 网页端：Vite 5 + React 18 + TS 5 + react-router-dom 6；
   - 管理后台（`/admin/*`）：复用同套 Vite + React + react-router-dom，配独立 layout（侧边栏 / 顶部 bar / 无 TabBar）。

6.5 **路由规范**：
   - C 端用户界面路径：`/` `/recommend` `/content` `/cover` `/publish-confirm` `/publish-success` `/orders` `/review` `/next-plan` `/memory`；
   - 管理后台路径：`/admin/login` `/admin`（仪表盘）`/admin/gifts` `/admin/orders` `/admin/users` `/admin/content` `/admin/memory` `/admin/finance`；
   - **禁止**让 C 端用户路径与 `/admin/*` 重叠。

6.6 **CI / Deploy**：MVP 阶段两端均配置 `lint / build / smoke` 三个最小脚本。

6.7 **支付 / 密钥 / 退款**：MVP mock；阶段二起任何涉及真实支付的改动必须读 `standards/SECURITY_AND_PAYMENT_GATE.md`。

6.8 **管理后台安全**：
   - MVP 阶段：admin 登录为单一密码（`.env.example` 占位），不接 OAuth；
   - 阶段二起：admin 路由必须挂真实鉴权中间件；
   - admin 接口**必须**审计（admin 操作写入操作日志，存 `src/data/admin-audit.json`，阶段二接云开发）；
   - admin **永远不可**直接修改用户 AI 记忆（仅可标记「需复审」由用户自助处理），这是宪法级不可逾越红线。

## §7 文档纪律

7.1 每个功能交付必须包含 spec / plan / tasks 三件套 + README 同步。
7.2 多文件改动（>=3）走 SDD；纯 UI 文案 / 颜色调整除外。
7.3 提交信息使用 `feat: / fix: / chore: / docs: / refactor: / test:` 前缀。
7.4 禁止 `.env` / 真实私钥 / 真实 AppID / 真实 admin 密码入仓。

## §8 风险豁免与变更

8.1 宪法修订须 PM 拍板。
8.2 MVP v0.6 阶段允许的「软豁免」：
   - 真实 AI 接入：mock LLM，接口形态 = ProviderCallResult；
   - 真实微信支付：mock；
   - 真实商品库：mock JSON；
   - admin 鉴权：单一密码。
8.3 豁免到期：阶段二（M1）起所有 mock 替换为真实接入，admin 鉴权接 OAuth。
