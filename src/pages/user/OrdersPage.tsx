import { useEffect, useState } from 'react';
import { MetricCard } from '../../components/user/MetricCard';
import { useOrdersStore } from '../../stores/orders-store';
import { formatYuan } from '../../utils/money';
import type { OrderStatus } from '../../types';

type Filter = 'all' | 'pending' | 'settled';
const FILTER_LABEL: Record<Filter, string> = { all: '全部', pending: '待结算', settled: '已结算' };

const STATUS_LABEL: Record<OrderStatus, string> = {
  CREATED: '待付款', PAID: '已付款', CLOSED: '已关闭',
  REFUNDING: '退款中', REFUNDED: '已退款', FAILED: '失败'
};

export function OrdersPage() {
  const [active, setActive] = useState<Filter>('all');
  const orders = useOrdersStore((s) => s.orders);
  const summary = useOrdersStore((s) => s.summary);
  const loadMock = useOrdersStore((s) => s.loadMock);

  useEffect(() => { loadMock(); }, [loadMock]);

  const filtered = orders.filter((o) => {
    if (active === 'all') return true;
    if (active === 'pending') return o.status === 'CREATED';
    return o.status === 'PAID' || o.status === 'CLOSED';
  });

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">订单与佣金</h1>
        <p className="gp-caption">实时跟踪每一笔订单与对应佣金</p>
      </header>

      <div className="gp-orders__metrics">
        <MetricCard label="今日预计佣金" valueFen={summary.today_fen} tone="green" />
        <MetricCard label="本月预计佣金" valueFen={summary.month_fen} tone="apricot" />
        <MetricCard label="预计订单佣金" valueFen={summary.expected_fen} tone="coral" hint="折算完整月" />
      </div>

      <div className="gp-recommend__tabs" style={{ margin: '16px 0' }}>
        {(Object.keys(FILTER_LABEL) as Filter[]).map((k) => (
          <button
            key={k}
            className={'gp-recommend__tab' + (active === k ? ' gp-recommend__tab--active' : '')}
            onClick={() => setActive(k)}
          >{FILTER_LABEL[k]}</button>
        ))}
      </div>

      <h2 className="gp-h2" style={{ marginBottom: 12 }}>最新订单</h2>
      <div className="gp-orders__list">
        {filtered.map((o) => (
          <div key={o.id} className="gp-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gp-caption">订单号：{o.id}</span>
              <span className={`gp-pill gp-pill--${o.status === 'CREATED' ? 'apricot' : 'green'}`}>
                {STATUS_LABEL[o.status]}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="gp-caption">订单金额</span>
              <span>{formatYuan(o.amount_fen)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="gp-caption">订单佣金</span>
              <span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>{formatYuan(o.commission_fen)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
