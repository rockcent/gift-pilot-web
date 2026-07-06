import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIStore } from '../../stores/ai-store';
import type { CoverTemplate } from '../../types';

const STYLES: CoverTemplate['style'][] = ['minimal', 'warm', 'fresh', 'vintage'];
const STYLE_LABEL: Record<CoverTemplate['style'], string> = {
  minimal: '简约高级', warm: '温柔治愈', fresh: '清新自然', vintage: '复古轻奢'
};

export function CoverPage() {
  const [activeStyle, setActiveStyle] = useState<CoverTemplate['style']>('minimal');
  const cover = useAIStore((s) => s.cover);
  const generateCover = useAIStore((s) => s.generateCover);
  const recommendation = useAIStore((s) => s.recommendation);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cover) {
      const giftId = recommendation?.gifts[0]?.id ?? 'gft_001';
      generateCover(giftId, activeStyle);
    }
  }, [cover, generateCover, recommendation, activeStyle]);

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">封面设计</h1>
        <p className="gp-caption">小礼已为你生成 4 种风格，选一张最贴近你朋友圈调性的</p>
      </header>

      {cover && (
        <section className="gp-card" style={{
          background: 'linear-gradient(160deg, var(--brand-apricot), var(--brand-bg))',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          padding: 32
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--brand-ink)', lineHeight: 1.3 }}>{cover.title}</div>
            <div className="gp-caption" style={{ marginTop: 8 }}>{cover.subtitle}</div>
          </div>
          <div style={{ position: 'absolute', right: 24, bottom: 24, fontSize: 96, opacity: 0.8 }}>🎁</div>
        </section>
      )}

      <section style={{ marginTop: 16 }}>
        <h2 className="gp-h2">封面风格</h2>
        <div className="gp-recommend__tabs" style={{ marginTop: 8 }}>
          {STYLES.map((s) => (
            <button
              key={s}
              className={'gp-recommend__tab' + (activeStyle === s ? ' gp-recommend__tab--active' : '')}
              onClick={() => {
                setActiveStyle(s);
                const giftId = recommendation?.gifts[0]?.id ?? 'gft_001';
                generateCover(giftId, s);
              }}
            >
              {STYLE_LABEL[s]}
            </button>
          ))}
        </div>
      </section>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--ghost">重新生成</button>
        <button className="gp-btn gp-btn--primary" onClick={() => navigate('/publish-confirm')}>下载保存 →</button>
      </div>
    </div>
  );
}
