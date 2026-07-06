import { useState } from 'react';
import contents from '../../data/mock-content.json';
import gifts from '../../data/mock-gifts.json';
import { DataTable } from '../../components/admin/DataTable';
import { Drawer } from '../../components/admin/Drawer';
import { FilterBar } from '../../components/admin/FilterBar';
import { writeAudit } from '../../audit/audit-log';
import type { ContentPiece } from '../../types';

const SEED = (contents as ContentPiece[]).flatMap((c, i) => [
  { ...c, id: `${c.id}_u1_${i}`, user: '小红', created_at: 1747000000000 + i * 100000, status: 'pending' as const },
  { ...c, id: `${c.id}_u2_${i}`, user: '阿明', created_at: 1747100000000 + i * 100000, status: 'pending' as const }
]);

interface ContentWithMeta extends ContentPiece { user: string; created_at: number; status: 'pending' | 'approved' | 'rejected'; }

export function ContentReviewPage() {
  const [list, setList] = useState<ContentWithMeta[]>(SEED);
  const [filter, setFilter] = useState<string>('pending');
  const [selected, setSelected] = useState<ContentWithMeta | null>(null);

  const filtered = list.filter((c) => filter === 'all' || c.status === filter);
  const giftTitle = (giftId: string) => gifts.find((g) => g.id === giftId)?.title ?? '';

  const setStatus = (id: string, next: 'approved' | 'rejected') => {
    setList((prev) => prev.map((c) => c.id === id ? { ...c, status: next } : c));
    writeAudit({ action: `content_${next}`, target: id });
    setSelected((s) => s?.id === id ? { ...s, status: next } : s);
  };

  return (
    <div>
      <FilterBar>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已打回</option>
        </select>
      </FilterBar>

      <DataTable<ContentWithMeta>
        rowKey={(r) => r.id}
        data={filtered}
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: 'user', title: '用户', width: 100 },
          { key: 'style_label', title: '风格', width: 100 },
          { key: 'body', title: '文案摘要', render: (r) => r.body.slice(0, 60) + '...' },
          { key: 'quality_score', title: '质量分', width: 80, align: 'right' },
          { key: 'created_at', title: '时间', width: 180, render: (r) => new Date(r.created_at).toLocaleString('zh-CN') },
          {
            key: 'status', title: '状态', width: 100,
            render: (r) => (
              <span className={`gp-pill ${r.status === 'approved' ? 'gp-pill--green' : r.status === 'rejected' ? 'gp-pill--coral' : 'gp-pill--apricot'}`}>
                {r.status === 'approved' ? '已通过' : r.status === 'rejected' ? '已打回' : '待审核'}
              </span>
            )
          }
        ]}
      />

      <Drawer
        open={!!selected}
        title="内容详情"
        onClose={() => setSelected(null)}
        width={520}
        footer={
          selected && selected.status === 'pending' && (
            <>
              <button className="gp-btn gp-btn--ghost" onClick={() => setStatus(selected.id, 'rejected')}>打回</button>
              <button className="gp-btn gp-btn--primary" onClick={() => setStatus(selected.id, 'approved')}>通过</button>
            </>
          )
        }
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">用户</span><span>{selected.user}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">风格</span><span>{selected.style_label}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">质量分</span><span>{selected.quality_score}</span></div>
            <div><div className="gp-caption">文案全文</div><p style={{ margin: '4px 0 0', padding: 12, background: 'var(--brand-bg)', borderRadius: 8, fontSize: 14 }}>{selected.body}</p></div>
            <div><div className="gp-caption">标签</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.tags.map((t) => <span key={t} className="gp-pill gp-pill--apricot">#{t}</span>)}</div></div>
            <p className="gp-caption" style={{ margin: 0 }}>MVP 阶段：通过 / 打回仅记录审计，不影响实际发布状态。</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
