import './BarChart.scss';

export interface BarItem {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarItem[];
  maxValue?: number;
}

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="gp-bar">
      {data.map((d) => (
        <div key={d.label} className="gp-bar__row">
          <div className="gp-bar__label" title={d.label}>{d.label}</div>
          <div className="gp-bar__track">
            <div className="gp-bar__fill" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="gp-bar__value">{d.value}</div>
        </div>
      ))}
    </div>
  );
}
