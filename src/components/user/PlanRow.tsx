import type { PlanItem } from '../../types';
import './PlanRow.scss';

const STATUS_LABEL: Record<PlanItem['status'], string> = {
  PLANNED: '待推荐',
  GENERATED: '已生成',
  DONE: '已完成'
};

export interface PlanRowProps {
  item: PlanItem;
}

export function PlanRow({ item }: PlanRowProps) {
  return (
    <div className="gp-plan-row">
      <div className="gp-plan-row__date">{item.week_date}</div>
      <div className="gp-plan-row__body">
        <div className="gp-plan-row__top">
          <div className="gp-plan-row__scene">{item.scene}</div>
          <span className="gp-pill gp-pill--apricot">{STATUS_LABEL[item.status]}</span>
        </div>
        <div className="gp-plan-row__meta">
          <span>🎯 {item.relation}</span>
          <span>💰 {item.budget_text}</span>
          <span>⏰ {item.suggested_time}</span>
        </div>
      </div>
    </div>
  );
}
