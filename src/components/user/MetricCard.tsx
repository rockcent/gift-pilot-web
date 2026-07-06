import { formatYuan } from '../../utils/money';
import './MetricCard.scss';

export interface MetricCardProps {
  label: string;
  valueFen?: number;
  valueText?: string;
  tone?: 'green' | 'apricot' | 'coral' | 'ink';
  hint?: string;
}

export function MetricCard({ label, valueFen, valueText, tone = 'green', hint }: MetricCardProps) {
  return (
    <div className={`gp-metric-card gp-metric-card--${tone}`}>
      <div className="gp-metric-card__label">{label}</div>
      <div className="gp-metric-card__value">{valueText ?? (valueFen !== undefined ? formatYuan(valueFen) : '—')}</div>
      {hint && <div className="gp-metric-card__hint">{hint}</div>}
    </div>
  );
}
