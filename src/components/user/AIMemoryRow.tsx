import { formatYuanRange } from '../../utils/money';
import './AIMemoryRow.scss';

export interface AIMemoryRowProps {
  index: number;
  label: string;
  text?: string;
  range?: [number, number];
  tags?: string[];
  onEdit?: () => void;
}

export function AIMemoryRow({ index, label, text, range, tags, onEdit }: AIMemoryRowProps) {
  return (
    <div className="gp-mem-row">
      <div className="gp-mem-row__index">{index}</div>
      <div className="gp-mem-row__body">
        <div className="gp-mem-row__label">{label}</div>
        {text && <div className="gp-mem-row__text">{text}</div>}
        {range && <div className="gp-mem-row__text">{formatYuanRange(range[0], range[1])}</div>}
        {tags && (
          <div className="gp-mem-row__tags">
            {tags.map((t) => (
              <span key={t} className="gp-pill gp-pill--apricot">{t}</span>
            ))}
          </div>
        )}
      </div>
      <button className="gp-mem-row__edit" onClick={onEdit}>✎</button>
    </div>
  );
}
