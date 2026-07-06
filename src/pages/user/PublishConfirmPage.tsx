import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIStore } from '../../stores/ai-store';

type Channel = 'timeline' | 'channels' | 'article';
const CHANNEL_LABEL: Record<Channel, string> = { timeline: '朋友圈', channels: '视频号', article: '微信图文' };

export function PublishConfirmPage() {
  const [channels, setChannels] = useState<Channel[]>(['timeline']);
  const recommendation = useAIStore((s) => s.recommendation);
  const contents = useAIStore((s) => s.contents);
  const cover = useAIStore((s) => s.cover);
  const buildPublish = useAIStore((s) => s.buildPublish);
  const confirmPublish = useAIStore((s) => s.confirmPublish);
  const navigate = useNavigate();

  const toggle = (c: Channel) => {
    setChannels((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const onConfirm = () => {
    if (!recommendation || !contents.length || !cover) return;
    const pub = buildPublish(recommendation.id, contents[0].id, cover.id, channels);
    confirmPublish();
    navigate('/publish-success');
  };

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">即将发布的内容</h1>
        <p className="gp-caption">检查封面、文案、发布渠道与时间建议</p>
      </header>

      {cover && contents[0] && (
        <section className="gp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(160deg, var(--brand-apricot), var(--brand-bg))',
            padding: 24, minHeight: 160, position: 'relative'
          }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{cover.title}</div>
            <div className="gp-caption" style={{ marginTop: 4 }}>{cover.subtitle}</div>
            <div style={{ position: 'absolute', right: 16, bottom: 16, fontSize: 64, opacity: 0.7 }}>🎁</div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="gp-pill gp-pill--green">{contents[0].style_label}</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{contents[0].body}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {contents[0].tags.map((t) => (
                <span key={t} className="gp-pill gp-pill--apricot">#{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="gp-card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="gp-h2">发布渠道</h2>
        <div className="gp-recommend__tabs">
          {(Object.keys(CHANNEL_LABEL) as Channel[]).map((c) => (
            <button
              key={c}
              className={'gp-recommend__tab' + (channels.includes(c) ? ' gp-recommend__tab--active' : '')}
              onClick={() => toggle(c)}
            >
              {channels.includes(c) ? '✓ ' : ''}{CHANNEL_LABEL[c]}
            </button>
          ))}
        </div>
      </section>

      <section className="gp-card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 className="gp-h2">发布时间建议</h2>
        <div style={{
          background: 'rgba(35, 178, 109, 0.08)',
          borderRadius: 'var(--radius-mini)',
          padding: 12,
          color: 'var(--brand-green)',
          fontWeight: 500
        }}>⏰ 今晚 20:30 - 22:00 最佳</div>
        <p className="gp-caption" style={{ margin: 0 }}>同款礼物在这个时间段的点击率最高</p>
      </section>

      <section className="gp-card" style={{ marginTop: 16 }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-green), var(--brand-apricot))',
          color: '#fff',
          borderRadius: 'var(--radius-card)',
          padding: 24,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12
        }}>
          <span style={{ fontSize: 36, fontWeight: 700 }}>92</span>
          <span style={{ fontSize: 18, opacity: 0.7 }}>/100</span>
          <span style={{ marginLeft: 'auto', fontSize: 13 }}>内容质量评分</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
          {([['广告感', '低'], ['情感表达', '高'], ['流畅度', '高'], ['吸引力', '高']] as const).map(([k, v]) => (
            <div key={k} style={{
              background: 'var(--brand-bg)',
              borderRadius: 'var(--radius-mini)',
              padding: 12,
              textAlign: 'center'
            }}>
              <div className="gp-caption">{k}</div>
              <div style={{ color: 'var(--brand-green)', fontWeight: 500, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--primary gp-btn--block" onClick={onConfirm}>确认发布</button>
      </div>
    </div>
  );
}
