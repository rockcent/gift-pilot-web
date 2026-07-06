import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentCard } from '../../components/user/ContentCard';
import { useAIStore } from '../../stores/ai-store';

type Tab = 'copy' | 'voice' | 'art' | 'strategy';
const TAB_LABEL: Record<Tab, string> = {
  copy: '文案生成', voice: '话术', art: '短组画', strategy: '图文策略'
};

export function ContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('copy');
  const [activeId, setActiveId] = useState<string | null>(null);
  const contents = useAIStore((s) => s.contents);
  const generateContent = useAIStore((s) => s.generateContent);
  const recommendation = useAIStore((s) => s.recommendation);
  const navigate = useNavigate();

  useEffect(() => {
    if (contents.length === 0) {
      const giftId = recommendation?.gifts[0]?.id ?? 'gft_001';
      generateContent(giftId, 'share');
    }
  }, [contents.length, generateContent, recommendation]);

  useEffect(() => {
    if (contents.length > 0 && !activeId) setActiveId(contents[0].id);
  }, [contents, activeId]);

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">为你生成了 {contents.length} 种风格文案</h1>
        <p className="gp-caption">选一段最贴近你想表达的语气，复制即可使用</p>
      </header>

      <div className="gp-recommend__tabs" style={{ marginBottom: 16 }}>
        {(Object.keys(TAB_LABEL) as Tab[]).map((k) => (
          <button
            key={k}
            className={'gp-recommend__tab' + (activeTab === k ? ' gp-recommend__tab--active' : '')}
            onClick={() => setActiveTab(k)}
          >
            {TAB_LABEL[k]}
          </button>
        ))}
      </div>

      <div>
        {contents.map((c) => (
          <ContentCard
            key={c.id}
            content={c}
            active={c.id === activeId}
            onCopy={() => {
              setActiveId(c.id);
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(c.body);
              }
            }}
            onRegenerate={() => setActiveId(c.id)}
            onOptimize={() => setActiveId(c.id)}
          />
        ))}
      </div>

      <section className="gp-card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="gp-caption">推荐标题（可改）</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>送同事的高颜值香氛礼盒！好闻又体面</div>
        </div>
        <div>
          <div className="gp-caption">推荐标签</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {['生日', '礼物', '同事', '香氛', '礼盒'].map((t) => (
              <span key={t} className="gp-pill gp-pill--apricot">#{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--primary" onClick={() => navigate('/cover')}>
          生成封面 →
        </button>
      </div>
    </div>
  );
}
