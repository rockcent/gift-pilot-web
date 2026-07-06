import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiftCard } from '../../components/user/GiftCard';
import { useAIStore } from '../../stores/ai-store';
import './RecommendPage.scss';

export function RecommendPage() {
  const [activeTab, setActiveTab] = useState<'best' | 'decent' | 'commission'>('best');
  const recommendation = useAIStore((s) => s.recommendation);
  const recommend = useAIStore((s) => s.recommend);
  const generateContent = useAIStore((s) => s.generateContent);
  const navigate = useNavigate();

  useEffect(() => {
    if (!recommendation) {
      recommend({ relation: '同事', budget_fen: 20000, scene: '生日', tone: 'warm', raw_query: '' });
    }
  }, [recommendation, recommend]);

  const onPick = async (giftId: string) => {
    await generateContent(giftId, 'share');
    navigate('/content');
  };

  const gifts = recommendation?.gifts ?? [];

  return (
    <div className="gp-recommend">
      <header className="gp-recommend__header">
        <h1 className="gp-h1">为你推荐 {gifts.length} 份合适的礼物</h1>
        <p className="gp-caption">结合关系、场景、预算和氛围为你服务</p>
        <div className="gp-recommend__tabs">
          {([['best', '最匹配'], ['decent', '更体面点'], ['commission', '佣金更高']] as const).map(([k, label]) => (
            <button
              key={k}
              className={'gp-recommend__tab' + (activeTab === k ? ' gp-recommend__tab--active' : '')}
              onClick={() => setActiveTab(k)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="gp-recommend__grid">
        {gifts.map((g, i) => (
          <GiftCard key={g.id} gift={g} rank={i + 1} onPick={onPick} />
        ))}
      </div>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--ghost">换一版</button>
        <button className="gp-btn gp-btn--primary">调整条件</button>
      </div>
    </div>
  );
}
