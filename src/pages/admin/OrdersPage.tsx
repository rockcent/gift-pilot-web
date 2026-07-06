import { useState } from 'react';
import ordersData from '../../data/mock-orders.json';
import giftsData from '../../data/mock-gifts.json';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { Drawer } from '../../components/admin/Drawer';
import { writeAudit } from '../../audit/audit-log';
import { formatYuan } from '../../utils/money';
import type { Order, OrderStatus } from '../../types';

const SEED = ordersData as Order[];

const STATUS_LABEL: Record<OrderStatus, string> = {
  CREATED: '待付款', PAID: '已付款', CLOSED: '已关闭',
  REFUNDING: '退款中', REFUNDED: '已退款', FAILED: '失败'
};

export function AdminOrdersPage() {
  const [list, setList] = useState<Order[]>(SEED);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = list.filter((o) => filterStatus === 'all' || o.status === filterStatus);

  const giftTitle = (giftId: string) => (giftsData.find((g) => g.id === giftId)?.title ?? giftId);

  const setStatus = (id: string, next: OrderStatus) => {
    setList((prev) => prev.map((o) => o.id === id ? { ...o, status: next, paid_at: next === 'PAID' ? Date.now() : o.paid_at, closed_at: next === 'CLOSED' ? Date.now() : o.closed_at } : o));
    writeAudit({ action: 'order_status', target: id, meta: { next } });
    setSelected((s) => s?.id === id ? { ...s, status: next } : s);
  };

  return (
    <div>
      <FilterBar>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">全部状态</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </FilterBar>

      <DataTable<Order>
        rowKey={(r) => r.id}
        data={filtered}
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: 'id', title: '订单号', width: 160 },
          { key: 'gift_id', title: '礼物', render: (r) => giftTitle(r.gift_id) },
          { key: 'amount_fen', title: '金额', width: 100, render: (r) => formatYuan(r.amount_fen) },
          { key: 'commission_fen', title: '佣金', width: 100, render: (r) => <span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>{formatYuan(r.commission_fen)}</span> },
          {
            key: 'status', title: '状态', width: 100,
            render: (r) => (
              <span className={`gp-pill ${r.status === 'CREATED' ? 'gp-pill--apricot' : r.status === 'FAILED' ? 'gp-pill--coral' : 'gp-pill--green'}`}>
                {STATUS_LABEL[r.status]}
              </span>
            )
          },
          { key: 'created_at', title: '创建时间', width: 180, render: (r) => new Date(r.created_at).toLocaleString('zh-CN') }
        ]}
      />

      <Drawer
        open={!!selected}
        title={`订单详情 · ${selected?.id ?? ''}`}
        onClose={() => setSelected(null)}
        width={520}
        footer={
          selected && (
            <>
              <button className="gp-btn gp-btn--ghost" onClick={() => setSelected(null)}>关闭</button>
              {selected.status === 'CREATED' && <button className="gp-btn gp-btn--primary" onClick={() => setStatus(selected.id, 'PAID')}>标记为已付款</button>}
              {selected.status === 'PAID' && <button className="gp-btn gp-btn--ink" onClick={() => setStatus(selected.id, 'CLOSED')}>标记为已关闭</button>}
            </>
          )
        }
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">礼物</span><span>{giftTitle(selected.gift_id)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">金额</span><span>{formatYuan(selected.amount_fen)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">佣金</span><span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>{formatYuan(selected.commission_fen)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">状态</span><span>{STATUS_LABEL[selected.status]}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">创建时间</span><span>{new Date(selected.created_at).toLocaleString('zh-CN')}</span></div>
            {selected.publish_id && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">发布归因</span><span style={{ fontSize: 12, fontFamily: 'monospace' }}>{selected.publish_id}</span></div>}
            {selected.buyer_note && <div><div className="gp-caption">买家备注</div><p style={{ margin: '4px 0 0', fontSize: 14 }}>{selected.buyer_note}</p></div>}
          </div>
        )}
      </Drawer>
    </div>
  );
}
