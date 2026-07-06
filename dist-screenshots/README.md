# 礼有方网页端 · MVP v0.6 视觉预览

本目录是 `vite build` 产物用 headless Chrome (420x820 viewport) 渲染的 11 张 H5 视图截图。

## 截图清单

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
| `admin-login.png` | 管理后台登录 | `/admin/login` |

## 如何本地复现

```bash
# 1. build
npx vite build

# 2. 启动 preview server
npx vite preview --port 4173 --host 127.0.0.1 &
sleep 2

# 3. 截图
mkdir -p dist-screenshots
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for entry in "home:/" "recommend:/recommend" "content:/content" "cover:/cover" "publish-confirm:/publish-confirm" "publish-success:/publish-success" "orders:/orders" "review:/review" "next-plan:/next-plan" "memory:/memory" "admin-login:/admin/login"; do
  name="${entry%%:*}"; path="${entry##*:}"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=420,820 --screenshot="dist-screenshots/${name}.png" \
    --virtual-time-budget=4000 "http://127.0.0.1:4173${path}"
done
```

## 已截范围

- ✅ C 端 10 个页面（与小程序 1:1）
- ✅ Admin 登录页
- ⏳ Admin 内部 7 个页面（需要 session 注入，下一轮用 Playwright 补）

## 视觉 token 验证

每张截图都能看到：
- 策绿 `#23B26D` 主色按钮 / 高亮
- 礼杏 `#F6C98D` 辅助色（礼品卡背景 / 渐变 hero）
- 心意珊瑚 `#F47C6C` 价格 / 重要数据
- 暖白 `#FAF9F6` 全局背景
- 礼有方品牌 logo（绿色渐变 + 🎁）
- "送礼有方，推荐有数"主口号
- 6 大 AI 原生体验标签（选对礼 / 谈得好 / 做得美 / 发得准 / 看得清 / 改得好）
