import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanRow } from '../../components/user/PlanRow';
import { useAIStore } from '../../stores/ai-store';

export function NextPlanPage() {
  const plan = useAIStore((s) => s.plan);
  const loadPlan = useAIStore((s) => s.loadPlan);
  const navigate = useNavigate();

  useEffect(() => { if (plan.length === 0) loadPlan(); }, [plan.length, loadPlan]);

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">小礼为你制定了下周计划</h1>
        <p className="gp-caption">05.12 - 05.18 · 基于记忆与复盘结果</p>
      </header>

      <div>{plan.map((p) => <PlanRow key={p.id} item={p} />)}</div>

      <section style={{
        background: 'rgba(246, 201, 141, 0.15)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        margin: '16px 0',
        display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#B0701F' }}>📌 不同关系给同周</div>
        <p className="gp-caption" style={{ margin: 0 }}>X、妈、家、同事属同关系对应发布信息看起来很重复，请注意发布差异化</p>
      </section>

      <div className="gp-recommend__cta">
        <button className="gp-btn gp-btn--primary gp-btn--block">一键生成内容</button>
        <button className="gp-btn gp-btn--ghost" onClick={() => navigate('/memory')}>管理我的计划</button>
      </div>
    </div>
  );
}
