import { useState } from 'react';
import ordersData from '../../data/mock-orders.json';
import { TrendChart } from '../../components/admin/TrendChart';
import { DataTable } from '../../components/admin/DataTable';
import { writeAudit } from '../../audit/audit-log';
import { formatYuan } from '../../utils/money';
import type { Order } from '../../types';

const LAST_7_DAYS = ['11/30', '12/01', '12/02', '12/03', '12/04', '12/05', '12/06'];
const trendData = [
  { name: '日佣金', color: '#23B26D', data: LAST_7_DAYS.map((label, i) => ({ label, value: 80 + Math.round(Math.sin(i) * 25 + i * 10) })) }
];

interface Withdraw {
  id: string;
  user: string;
  amount_fen: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: number;
}

const SEED_WITHDRAW: Withdraw[] = [
  { id: 'wd_001', user: '小红', amount_fen: 38600, status: 'pending', created_at: 1747000000000 },
  { id: 'wd_002', user: '阿明', amount_fen: 22400, status: 'pending', created_at: 1747100000000 },
  { id: 'wd_003', user: '李姐', amount_fen: 76800, status: 'approved', created_at: 1746800000000 }
];

const SETTLE_STATUS: Record<string, string> = { pending: '待结算', approved: '已结算', rejected: '已驳回', PAID: '已付款', CLOSED: '已关闭' };

export function FinancePage() {
  const [withdraws, setWithdraws] = useState<Withdraw[]>(SEED_WITHDRAW);
  const orders = ordersData as Order[];

  const totalCommission = orders.reduce((s, o) => s + o.commission_fen, 0);
  const paidCommission = orders.filter((o) => o.status === 'PAID' || o.status === 'CLOSED').reduce((s, o) => s + o.commission_fen, 0);
  const pendingWithdraw = withdraws.filter((w) => w.status === 'pending').reduce((s, w) => s + w.amount_fen, 0);

  const setWdStatus = (id: string, next: 'approved' | 'rejected') => {
    setWithdraws((prev) => prev.map((w) => w.id === id ? { ...w, status: next } : w));
    writeAudit({ action: `withdraw_${next}`, target: id });
  };

  return (
    <div>
      <div className="gp-admin__metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="gp-amc"><div className="gp-amc__label">累计佣金</div><div className="gp-amc__value gp-amc--green" style={{ color: 'var(--brand-green)' }}>{formatYuan(totalCommission)}</div></div>
        <div className="gp-amc"><div className="gp-amc__label">已结算</div><div className="gp-amc__value" style={{ color: '#B0701F' }}>{formatYuan(paidCommission)}</div></div>
        <div className="gp-amc"><div className="gp-amc__label">待提现</div><div className="gp-amc__value" style={{ color: 'var(--brand-coral)' }}>{formatYuan(pendingWithdraw)}</div></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <TrendChart series={trendData} />
      </div>

      <h2 className="gp-h2" style={{ fontSize: 16, margin: '24px 0 12px' }}>提现申请</h2>
      <DataTable<Withdraw>
        rowKey={(r) => r.id}
        data={withdraws}
        columns={[
          { key: 'id', title: '申请号', width: 120 },
          { key: 'user', title: '用户', width: 120 },
          { key: 'amount_fen', title: '金额', width: 120, render: (r) => formatYuan(r.amount_fen) },
          { key: 'created_at', title: '申请时间', width: 180, render: (r) => new Date(r.created_at).toLocaleString('zh-CN') },
          {
            key: 'status', title: '状态', width: 100,
            render: (r) => <span className={`gp-pill ${r.status === 'approved' ? 'gp-pill--green' : r.status === 'rejected' ? 'gp-pill--coral' : 'gp-pill--apricot'}`}>{SETTLE_STATUS[r.status]}</span>
          },
          {
            key: 'op', title: '操作', width: 200, align: 'center',
            render: (r) => r.status === 'pending' ? (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button className="gp-btn gp-btn--ghost" style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => setWdStatus(r.id, 'rejected')}>驳回</button>
                <button className="gp-btn gp-btn--primary" style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => setWdStatus(r.id, 'approved')}>通过</button>
              </div>
            ) : <span className="gp-caption">—</span>
          }
        ]}
      />
    </div>
  );
}
