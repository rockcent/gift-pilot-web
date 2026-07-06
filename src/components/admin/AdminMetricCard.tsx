import './AdminMetricCard.scss';

export interface AdminMetricCardProps {
  label: string;
  value: string;
  delta?: string;
  tone?: 'green' | 'apricot' | 'coral' | 'ink';
  hint?: string;
}

export function AdminMetricCard({ label, value, delta, tone = 'green', hint }: AdminMetricCardProps) {
  const deltaTone = delta?.startsWith('-') ? 'down' : delta ? 'up' : undefined;
  return (
    <div className={`gp-amc gp-amc--${tone}`}>
      <div className="gp-amc__label">{label}</div>
      <div className="gp-amc__value">{value}</div>
      {delta && (
        <div className={`gp-amc__delta gp-amc__delta--${deltaTone}`}>
          {deltaTone === 'up' ? '↑' : deltaTone === 'down' ? '↓' : '·'} {delta}
        </div>
      )}
      {hint && <div className="gp-amc__hint">{hint}</div>}
    </div>
  );
}
