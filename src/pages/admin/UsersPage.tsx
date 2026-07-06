import { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { Drawer } from '../../components/admin/Drawer';
import memorySeed from '../../data/mock-memory.json';
import type { AIMemory } from '../../types';

interface MockUser {
  id: string;
  nickname: string;
  openid: string;
  registered_at: number;
  order_count: number;
  total_commission_fen: number;
  memory_enabled: boolean;
  memory: AIMemory;
}

const USERS: MockUser[] = [
  { id: 'u_001', nickname: '小红', openid: 'oXyz...A1B2', registered_at: 1744000000000, order_count: 12, total_commission_fen: 38600, memory_enabled: true, memory: memorySeed as AIMemory },
  { id: 'u_002', nickname: '阿明', openid: 'oXyz...C3D4', registered_at: 1745000000000, order_count: 8, total_commission_fen: 22400, memory_enabled: true, memory: { ...(memorySeed as AIMemory), user_id: 'u_002', primary_relations: ['闺蜜', '同事'], budget_range_fen: [50000, 100000] } },
  { id: 'u_003', nickname: '李姐', openid: 'oXyz...E5F6', registered_at: 1746000000000, order_count: 24, total_commission_fen: 76800, memory_enabled: true, memory: { ...(memorySeed as AIMemory), user_id: 'u_003', primary_relations: ['长辈', '客户'], budget_range_fen: [20000, 50000] } },
  { id: 'u_004', nickname: '测试账号', openid: 'oXyz...G7H8', registered_at: 1747000000000, order_count: 0, total_commission_fen: 0, memory_enabled: false, memory: memorySeed as AIMemory }
];

export function UsersPage() {
  const [selected, setSelected] = useState<MockUser | null>(null);

  return (
    <div>
      <DataTable<MockUser>
        rowKey={(r) => r.id}
        data={USERS}
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: 'nickname', title: '昵称', render: (r) => <strong>{r.nickname}</strong> },
          { key: 'openid', title: 'OpenID', width: 140 },
          { key: 'registered_at', title: '注册时间', width: 180, render: (r) => new Date(r.registered_at).toLocaleDateString('zh-CN') },
          { key: 'order_count', title: '订单数', width: 80, align: 'right' },
          {
            key: 'total_commission_fen', title: '总佣金', width: 120, align: 'right',
            render: (r) => <span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>¥{(r.total_commission_fen / 100).toFixed(2)}</span>
          },
          {
            key: 'memory_enabled', title: 'AI 记忆', width: 100,
            render: (r) => <span className={`gp-pill ${r.memory_enabled ? 'gp-pill--green' : 'gp-pill--ink'}`}>{r.memory_enabled ? '开启' : '关闭'}</span>
          }
        ]}
      />

      <Drawer
        open={!!selected}
        title={`用户详情 · ${selected?.nickname ?? ''}`}
        onClose={() => setSelected(null)}
        width={520}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">OpenID</span><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{selected.openid}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">注册时间</span><span>{new Date(selected.registered_at).toLocaleString('zh-CN')}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">订单数</span><span>{selected.order_count}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">总佣金</span><span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>¥{(selected.total_commission_fen / 100).toFixed(2)}</span></div>

            <div style={{ borderTop: '1px solid var(--brand-line)', paddingTop: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>AI 记忆（只读）</h3>
              <p style={{ margin: '4px 0 12px', fontSize: 12, color: 'var(--brand-coral)' }}>
                ⚠ 宪法 §6.8 红线：AI 记忆属于用户私有，admin 不可修改。如需用户调整，请联系用户自助处理。
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div><div className="gp-caption">主要推荐对象</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.memory.primary_relations.map((t) => <span key={t} className="gp-pill gp-pill--apricot">{t}</span>)}</div></div>
                <div><div className="gp-caption">常用预算区间</div><div style={{ marginTop: 4 }}>¥{selected.memory.budget_range_fen[0] / 100} - ¥{selected.memory.budget_range_fen[1] / 100}</div></div>
                <div><div className="gp-caption">偏好风格</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.memory.preferred_styles.map((t) => <span key={t} className="gp-pill gp-pill--apricot">{t}</span>)}</div></div>
                <div><div className="gp-caption">擅长类目</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{selected.memory.favorite_categories.map((t) => <span key={t} className="gp-pill gp-pill--apricot">{t}</span>)}</div></div>
                <div><div className="gp-caption">最佳发布时间</div><div style={{ marginTop: 4 }}>{selected.memory.best_publish_window}</div></div>
                <div><div className="gp-caption">经营目标</div><div style={{ marginTop: 4 }}>{selected.memory.goal_text}</div></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
