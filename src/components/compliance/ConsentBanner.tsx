/* 礼有方网页端 · 隐私同意横幅
 *
 * 首次访问检测 hasConsented() → false 时显示。
 * - 必要项：固定勾选 + 禁用
 * - 分析 / 营销：可勾选
 * - 接受全部 / 仅必要 / 自定义 → acceptConsent()
 * - 拒绝全部 = 仅勾必要（GDPR 合规默认）
 */
import { useEffect, useState } from 'react';
import { acceptConsent, hasConsented, type ConsentCategory } from '../../services/consent';
import './ConsentBanner.scss';

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!hasConsented());
  }, []);

  if (!visible) return null;

  const onAccept = (choices: Record<ConsentCategory, boolean>) => {
    acceptConsent({ choices, source: 'banner' });
    setVisible(false);
  };

  return (
    <div className="gp-consent" role="dialog" aria-label="隐私同意" aria-modal="false">
      <div className="gp-consent__panel">
        <h2 className="gp-consent__title">🍪 我们重视您的隐私</h2>
        <p className="gp-consent__desc">
          礼有方使用 localStorage 存储您的 AI 记忆（关系画像、偏好、预算）和匿名设备标识符，用于个性化推荐与服务。
          您可分项选择是否同意非必要项。
        </p>

        <ul className="gp-consent__list">
          <li className="gp-consent__item">
            <label>
              <input type="checkbox" checked disabled aria-label="必要项，不可关闭" />
              <strong>必要</strong>
              <span>核心服务（AI 记忆 / 同意记录）</span>
            </label>
          </li>
          <li className="gp-consent__item">
            <label>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="分析项"
              />
              <strong>分析</strong>
              <span>匿名行为分析（当前未启用）</span>
            </label>
          </li>
          <li className="gp-consent__item">
            <label>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                aria-label="营销项"
              />
              <strong>营销</strong>
              <span>个性化推荐（当前未启用）</span>
            </label>
          </li>
        </ul>

        <div className="gp-consent__actions">
          <button
            type="button"
            className="gp-btn gp-btn--ghost"
            onClick={() => onAccept({ necessary: true, analytics: false, marketing: false })}
            data-testid="consent-reject-all"
          >
            仅必要
          </button>
          <button
            type="button"
            className="gp-btn gp-btn--secondary"
            onClick={() => onAccept({ necessary: true, analytics, marketing })}
            data-testid="consent-save"
          >
            保存我的选择
          </button>
          <button
            type="button"
            className="gp-btn gp-btn--primary"
            onClick={() => onAccept({ necessary: true, analytics: true, marketing: true })}
            data-testid="consent-accept-all"
          >
            接受全部
          </button>
        </div>

        <p className="gp-consent__legal">
          详见 <a href="/legal/privacy.html" target="_blank" rel="noreferrer">隐私政策</a> ·
          <a href="/legal/terms.html" target="_blank" rel="noreferrer">用户协议</a> ·
          <a href="/legal/cookies.html" target="_blank" rel="noreferrer">Cookie 政策</a>
        </p>
      </div>
    </div>
  );
}
