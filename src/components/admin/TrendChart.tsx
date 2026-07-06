import './TrendChart.scss';

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendChartProps {
  series: Array<{ name: string; color: string; data: TrendPoint[] }>;
  height?: number;
}

export function TrendChart({ series, height = 220 }: TrendChartProps) {
  const W = 720;
  const H = height;
  const padding = { top: 20, right: 16, bottom: 28, left: 36 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const allValues = series.flatMap((s) => s.data.map((d) => d.value));
  const maxVal = Math.max(1, ...allValues);
  const labels = series[0]?.data.map((d) => d.label) ?? [];

  const xAt = (i: number) =>
    padding.left + (labels.length > 1 ? (innerW * i) / (labels.length - 1) : innerW / 2);
  const yAt = (v: number) => padding.top + innerH - (innerH * v) / maxVal;

  return (
    <div className="gp-trend">
      <div className="gp-trend__legend">
        {series.map((s) => (
          <span key={s.name} className="gp-trend__legend-item">
            <span className="gp-trend__dot" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="gp-trend__svg" role="img" aria-label="趋势图">
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={padding.left}
            x2={W - padding.right}
            y1={padding.top + innerH * (1 - p)}
            y2={padding.top + innerH * (1 - p)}
            stroke="#ECECE7"
            strokeDasharray="3 3"
          />
        ))}
        {labels.map((lbl, i) => (
          <text key={lbl} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#6B7280">{lbl}</text>
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={s.data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(' ')}
            />
            {s.data.map((d, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(d.value)} r="3" fill={s.color} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
