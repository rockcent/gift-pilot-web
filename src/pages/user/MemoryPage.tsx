import { AIMemoryRow } from '../../components/user/AIMemoryRow';
import { useMemoryStore } from '../../stores/memory-store';
import { exportAllData } from '../../services/consent';

export function MemoryPage() {
  const memory = useMemoryStore((s) => s.memory);
  const update = useMemoryStore((s) => s.update);
  const clear = useMemoryStore((s) => s.clear);

  const onEdit = (idx: number) => {
    const labels = ['primary_relations', 'budget_range_fen', 'preferred_styles', 'favorite_categories', 'best_publish_window', 'goal_text'] as const;
    const newVal = prompt('编辑记忆（直接输入新值）');
    if (newVal == null) return;
    const key = labels[idx];
    if (key === 'budget_range_fen') {
      const m = newVal.match(/(\d+)\s*[-~到]\s*(\d+)/);
      if (m) update({ budget_range_fen: [Number(m[1]) * 100, Number(m[2]) * 100] });
    } else if (key === 'primary_relations') {
      update({ primary_relations: newVal.split(/[,，、\s]+/).filter(Boolean) });
    } else if (key === 'preferred_styles') {
      update({ preferred_styles: newVal.split(/[,，、\s]+/).filter(Boolean) });
    } else if (key === 'favorite_categories') {
      update({ favorite_categories: newVal.split(/[,，、\s]+/).filter(Boolean) });
    } else {
      update({ [key]: newVal });
    }
  };

  const onClear = () => {
    if (confirm('确认清空 AI 记忆？此操作不可恢复。')) clear();
  };

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">小礼对你的观察（可编辑）</h1>
        <p className="gp-caption">基于你的发布与推荐点击习惯</p>
      </header>

      <div>
        <AIMemoryRow index={1} label="主要推荐对象" tags={memory.primary_relations} onEdit={() => onEdit(0)} />
        <AIMemoryRow index={2} label="常用预算区间" range={memory.budget_range_fen} onEdit={() => onEdit(1)} />
        <AIMemoryRow index={3} label="偏好文章风格" tags={memory.preferred_styles} onEdit={() => onEdit(2)} />
        <AIMemoryRow index={4} label="擅长商品类目" tags={memory.favorite_categories} onEdit={() => onEdit(3)} />
        <AIMemoryRow index={5} label="最佳发布时间" text={memory.best_publish_window} onEdit={() => onEdit(4)} />
        <AIMemoryRow index={6} label="经营目标" text={memory.goal_text} onEdit={() => onEdit(5)} />
      </div>

      <div className="gp-recommend__cta">
        <button
            className="gp-btn gp-btn--ghost"
            onClick={onClear}
            aria-label="一键清除 AI 记忆（宪法 §4.6）"
          >
            🗑️ 一键清除记忆
          </button>
        <button
          className="gp-btn gp-btn--secondary"
          onClick={() => {
            const data = exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `giftpilot-memory-${data.exportedAt}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          aria-label="导出我的全部数据（GDPR Art. 15 数据访问权）"
          data-testid="export-memory-btn"
        >
          📦 导出我的数据
        </button>
        <button className="gp-btn gp-btn--primary gp-btn--block" onClick={() => alert('MVP mock：阶段二将开放多轮偏好编辑')}>继续我的偏好</button>
      </div>
    </div>
  );
}
