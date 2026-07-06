import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/user/MetricCard';
import { useAIStore } from '../../stores/ai-store';
import { formatYuan } from '../../utils/money';

export function ReviewPage() {
  const review = useAIStore((s) => s.review);
  const loadReview = useAIStore((s) => s.loadReview);
  const navigate = useNavigate();

  useEffect(() => { if (!review) loadReview(); }, [review, loadReview]);

  if (!review) return <p className="gp-caption">小礼正在生成复盘中…</p>;

  const fromDate = new Date(review.range.from_ts);
  const toDate = new Date(review.range.to_ts);
  const fmt = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">小礼为你生成了本周经营复盘</h1>
        <p className="gp-caption">{fmt(fromDate)} - {fmt(toDate)}</p>
      </header>

      <div className="gp-orders__metrics">
        <MetricCard label="总发布" valueText={`${review.total_publish} 篇`} tone="green" />
        <MetricCard label="总订单" valueText={`${review.total_orders} 笔`} tone="apricot" />
        <MetricCard label="预计佣金" valueFen={review.expected_commission_fen} tone="coral" />
      </div>

      <div className="gp-orders__metrics" style={{ marginTop: 12 }}>
        <MetricCard label="点击量" valueText={String(review.click_count)} tone="ink" />
        <MetricCard label="点击率" valueText={`${(review.click_rate * 100).toFixed(2)}%`} tone="green" />
        <MetricCard label="客单价" valueFen={review.aov_fen} tone="apricot" />
      </div>

      <section className="gp-card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 className="gp-h2">📈 数据亮点</h2>
        {review.highlights.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--brand-green)' }} />
            <span style={{ fontSize: 14 }}>{h}</span>
          </div>
        ))}
      </section>

      <section className="gp-card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 className="gp-h2">��� 下周建议</h2>
        {review.next_suggestions.map((h, i) => (
          <div key={i} className="gp-pill gp-pill--green" style={{ padding: '6px 12px', fontSize: 14, alignSelf: 'flex-start' }}>{h}</div>
        ))}
      </section>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--primary gp-btn--block" onClick={() => navigate('/next-plan')}>
          生成下周发布计划
        </button>
      </div>
    </div>
  );
}
