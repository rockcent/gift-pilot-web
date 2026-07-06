# 礼有方网页端 · MVP v0.6 视觉预览

`vite build` + headless Chrome 渲染的 18 张 H5 视图截图（420x820 viewport @ devicePixelRatio 2）。

> **完整视觉预览集：28 张**（本目录 18 张 + 小程序 10 张，参见 [`../../gift-pilot-miniprogram/dist-screenshots/`](../../gift-pilot-miniprogram/dist-screenshots/)）。

## 截图清单

### C 端用户界面（11 张 · 420x820）

| 文件 | 页面 | 路由 |
|---|---|---|
| `home.png` | 表达需求（AI 对话首页） | `/` |
| `recommend.png` | AI 选品推荐 | `/recommend` |
| `content.png` | 内容生成工作台 | `/content` |
| `cover.png` | 封面设计 | `/cover` |
| `publish-confirm.png` | 发布确认 | `/publish-confirm` |
| `publish-success.png` | 发布成功 | `/publish-success` |
| `orders.png` | 订单与佣金 | `/orders` |
| `review.png` | 经营复盘 | `/review` |
| `next-plan.png` | AI 下一步计划 | `/next-plan` |
| `memory.png` | 我的 AI 记忆 | `/memory` |

### B 端管理后台（8 张 · 840x1640）

| 文件 | 页面 | 路由 |
|---|---|---|
| `admin-login.png` | 管理后台登录 | `/admin/login` |
| `admin-dashboard.png` | 仪表盘（DAU/发布/订单/GMV + 7 日趋势） | `/admin` |
| `admin-gifts.png` | 商品管理（CRUD 表格） | `/admin/gifts` |
| `admin-orders.png` | 订单管理（详情抽屉 + 状态调整） | `/admin/orders` |
| `admin-users.png` | 用户管理（含 AI 记忆只读抽屉） | `/admin/users` |
| `admin-content.png` | 内容审核（通过/打回） | `/admin/content` |
| `admin-memory.png` | AI 记忆审核（⚠ §6.8 红线强制提示） | `/admin/memory` |
| `admin-finance.png` | 财务概览（佣金趋势 + 提现处理） | `/admin/finance` |

## 视觉 token 验证

每张截图都验证：
- ✅ 策绿 `#23B26D` 主色按钮 / 高亮 / 趋势线
- ✅ 礼杏 `#F6C98D` 辅助色（封面渐变 / 礼盒背景）
- ✅ 心意珊瑚 `#F47C6C` 价格 / 佣金 / 红线警示
- ✅ 暖白 `#FAF9F6` 全局背景
- ✅ 礼有方品牌 logo（绿色渐变 + 🎁 emoji）
- ✅ "送礼有方，推荐有数"主口号（footer）
- ✅ 6 大 AI 原生体验标签（选对礼 / 谈得好 / 做得美 / 发得准 / 看得清 / 改得好）

## 关键宪法 / 不变量验证

- ✅ admin 路由鉴权（puppeteer 注入 session 才能访问 admin 内部页面）
- ✅ **§6.8 红线**：`admin-memory.png` 顶部红色警示框 + 「admin 不可修改」强制文案
- ✅ 操作审计日志：所有 admin 写操作（订单状态 / 礼物上下架 / 内容审核 / 提现 / 记忆标记）写入 localStorage `gp-admin-audit`
- ✅ 金额整数规范：所有价格 / 佣金展示均从「分」转换

## 如何本地复现

```bash
# 1. 装依赖 + build
pnpm install
pnpm run build

# 2. 启动 preview server
npx vite preview --port 4173 --host 127.0.0.1 &
sleep 2

# 3. C 端 10 + admin login（headless Chrome 命令行）
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for entry in "home:/" "recommend:/recommend" "content:/content" "cover:/cover" \
             "publish-confirm:/publish-confirm" "publish-success:/publish-success" \
             "orders:/orders" "review:/review" "next-plan:/next-plan" "memory:/memory" \
             "admin-login:/admin/login"; do
  name="${entry%%:*}"; path="${entry##*:}"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=420,820 --screenshot="dist-screenshots/${name}.png" \
    --virtual-time-budget=4000 "http://127.0.0.1:4173${path}"
done

# 4. Admin 内部 7 张（puppeteer 注入 session）
node ./scripts/screenshot-admin.mjs
```

## 与小程序端的对比

| 维度 | 网页端（本目录） | 小程序 |
|---|---|---|
| 用户界面 | ✅ 10 页 C 端 + 8 页 admin | ✅ 10 页 |
| 视觉 token | ✅ | ✅ |
| 平台构建 | Vite 5 + React | Taro 3.6 H5 |
| 截图张数 | 18 | 10 |

两份截图源（types / data / services / mock）1:1，**视觉与文案完全一致**，是阶段二接通真实后端的回归 baseline。

## 下一步

- 阶段二：接通真实后端后，截图脚本可一键回归（保持视觉一致性）
- 阶段二：真实 LLM / 真实微信支付接入后，截图可作为 regression baseline
