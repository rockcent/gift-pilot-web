import { useState } from 'react';
import memorySeed from '../../data/mock-memory.json';
import type { AIMemory } from '../../types';
import { DataTable } from '../../components/admin/DataTable';
import { Drawer } from '../../components/admin/Drawer';
import { writeAudit } from '../../audit/audit-log';

interface MemoryAuditRow {
  id: string;
  user: string;
  reason: string;
  budget_high_fen: number;
  categories: string[];
  memory: AIMemory;
  reviewed: boolean;
}

/* 异常记忆（mock）：异常预算 / 异常类目 */
const SEED: MemoryAuditRow[] = [
  {
    id: 'mem_a_001',
    user: '测试账号 A',
    reason: '常用预算上限 > ¥1000，可能涉及高价值礼品',
    budget_high_fen: 150000,
    categories: ['奢侈品', '珠宝'],
    memory: { ...(memorySeed as AIMemory), user_id: 'mem_a_001', primary_relations: ['客户'], budget_range_fen: [50000, 150000], favorite_categories: ['奢侈品', '珠宝'] },
    reviewed: false
  },
  {
    id: 'mem_a_002',
    user: '测试账号 B',
    reason: '擅长类目含医疗相关，可能涉及医疗器械',
    budget_high_fen: 30000,
    categories: ['医疗'],
    memory: { ...(memorySeed as AIMemory), user_id: 'mem_a_002', primary_relations: ['长辈'], budget_range_fen: [10000, 30000], favorite_categories: ['医疗', '保健'] },
    reviewed: false
  }
];

export function MemoryAuditPage() {
  const [list, setList] = useState<MemoryAuditRow[]>(SEED);
  const [selected, setSelected] = useState<MemoryAuditRow | null>(null);

  const flag = (id: string) => {
    setList((prev) => prev.map((m) => m.id === id ? { ...m, reviewed: true } : m));
    writeAudit({ action: 'memory_flag', target: id });
    setSelected((s) => s?.id === id ? { ...s, reviewed: true } : s);
  };

  return (
    <div>
      <div style={{ background: 'rgba(244, 124, 108, 0.10)', border: '1px solid var(--brand-coral)', borderRadius: 'var(--radius-card)', padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18 }}>⚠</span>
        <div>
          <strong>宪法 §6.8 红线</strong>：AI 记忆属于用户私有，<strong>admin 不可修改</strong>。本页仅提供「标记需复审」入口，由用户自助处理。
        </div>
      </div>

      <DataTable<MemoryAuditRow>
        rowKey={(r) => r.id}
        data={list}
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: 'user', title: '用户', width: 120 },
          { key: 'reason', title: '异常原因' },
          { key: 'budget_high_fen', title: '预算上限', width: 120, render: (r) => `¥${(r.budget_high_fen / 100).toFixed(0)}` },
          { key: 'categories', title: '异常类目', width: 200, render: (r) => <span style={{ color: 'var(--brand-coral)' }}>{r.categories.join(', ')}</span> },
          {
            key: 'reviewed', title: '复审状态', width: 100,
            render: (r) => <span className={`gp-pill ${r.reviewed ? 'gp-pill--green' : 'gp-pill--coral'}`}>{r.reviewed ? '已标记' : '待复审'}</span>
          }
        ]}
      />

      <Drawer
        open={!!selected}
        title={`异常记忆 · ${selected?.user ?? ''}`}
        onClose={() => setSelected(null)}
        width={520}
        footer={
          selected && !selected.reviewed && (
            <>
              <button className="gp-btn gp-btn--ghost" onClick={() => setSelected(null)}>关闭</button>
              <button className="gp-btn gp-btn--primary" onClick={() => flag(selected.id)}>标记需复审</button>
            </>
          )
        }
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(244, 124, 108, 0.10)', borderRadius: 8, padding: 12, color: 'var(--brand-coral)' }}>
              <strong>异常原因：</strong>{selected.reason}
            </div>
            <div><div className="gp-caption">主要推荐对象</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.memory.primary_relations.map((t) => <span key={t} className="gp-pill gp-pill--apricot">{t}</span>)}</div></div>
            <div><div className="gp-caption">常用预算区间</div><div style={{ marginTop: 4 }}>¥{selected.memory.budget_range_fen[0] / 100} - ¥{selected.memory.budget_range_fen[1] / 100}</div></div>
            <div><div className="gp-caption">擅长类目</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.memory.favorite_categories.map((t) => <span key={t} className="gp-pill gp-pill--coral">{t}</span>)}</div></div>
            <p style={{ fontSize: 13, color: 'var(--brand-coral)', margin: 0 }}>⚠ 此处仅供审计查看，admin 无法直接修改。请联系用户自行调整记忆。</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
