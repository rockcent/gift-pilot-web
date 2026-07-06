import { AdminMetricCard } from '../../components/admin/AdminMetricCard';
import { TrendChart } from '../../components/admin/TrendChart';
import { BarChart } from '../../components/admin/BarChart';

const LAST_7_DAYS = ['11/30', '12/01', '12/02', '12/03', '12/04', '12/05', '12/06'];
const trendSeries = [
  {
    name: '发布数',
    color: '#23B26D',
    data: LAST_7_DAYS.map((label, i) => ({ label, value: 90 + Math.round(Math.sin(i) * 25 + i * 4) }))
  },
  {
    name: '订单数',
    color: '#F6C98D',
    data: LAST_7_DAYS.map((label, i) => ({ label, value: 30 + Math.round(Math.cos(i) * 12 + i * 3) }))
  },
  {
    name: '佣金 (¥)',
    color: '#F47C6C',
    data: LAST_7_DAYS.map((label, i) => ({ label, value: 150 + Math.round(Math.sin(i * 1.2) * 50 + i * 8) }))
  }
];
const topGifts = [
  { label: '香氛礼盒（治愈系）', value: 412 },
  { label: '永生花香氛盒', value: 326 },
  { label: '母亲节健康礼盒', value: 289 },
  { label: '小众香水礼盒', value: 218 },
  { label: '茶具礼盒', value: 187 }
];
const topRelations = [
  { label: '同事', value: 562 },
  { label: '闺蜜', value: 487 },
  { label: '长辈', value: 391 },
  { label: '客户', value: 224 },
  { label: '同学', value: 178 }
];

export function DashboardPage() {
  return (
    <div>
      <div className="gp-admin__metrics">
        <AdminMetricCard label="DAU" value="1,234" delta="+12.3%" tone="green" />
        <AdminMetricCard label="发布数" value="856" delta="+8.1%" tone="apricot" />
        <AdminMetricCard label="订单数" value="312" delta="-2.4%" tone="coral" />
        <AdminMetricCard label="GMV" value="¥98,420" delta="+15.2%" tone="ink" />
      </div>

      <div className="gp-admin__metrics-2">
        <AdminMetricCard label="复盘触发率" value="78%" delta="+3.1%" tone="green" />
        <AdminMetricCard label="内容生成" value="1,902" delta="+22.5%" tone="apricot" />
        <AdminMetricCard label="封面设计" value="1,536" delta="+18.2%" tone="ink" />
        <AdminMetricCard label="AI 记忆使用率" value="64%" delta="+1.8%" tone="green" />
      </div>

      <div className="gp-admin__chart-row">
        <TrendChart series={trendSeries} />
        <div className="gp-card" style={{ padding: 16 }}>
          <h2 className="gp-h2" style={{ fontSize: 16, marginBottom: 12 }}>Top 5 礼物</h2>
          <BarChart data={topGifts} />
        </div>
      </div>

      <div className="gp-card">
        <h2 className="gp-h2" style={{ fontSize: 16, marginBottom: 12 }}>Top 5 推荐对象</h2>
        <BarChart data={topRelations} />
      </div>
    </div>
  );
}
