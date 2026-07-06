import { Link } from 'react-router-dom';
import type { Gift } from '../../types';
import { formatYuan } from '../../utils/money';
import './GiftCard.scss';

export interface GiftCardProps {
  gift: Gift;
  rank?: number;
  onPick?: (id: string) => void;
}

export function GiftCard({ gift, rank, onPick }: GiftCardProps) {
  return (
    <div className="gp-gift-card">
      <div className="gp-gift-card__cover">
        <span className="gp-gift-card__placeholder">🎁</span>
        {rank !== undefined && <span className="gp-gift-card__rank">{rank}</span>}
      </div>
      <div className="gp-gift-card__body">
        <div className="gp-gift-card__title">{gift.title}</div>
        <div className="gp-gift-card__brand">{gift.brand}</div>
        <div className="gp-gift-card__price">{formatYuan(gift.price_fen)}</div>
        <div className="gp-gift-card__tags">
          {gift.relation_tags.map((t) => (
            <span key={t} className="gp-pill gp-pill--apricot">{t}</span>
          ))}
          <span className="gp-pill gp-pill--ink">{gift.category}</span>
        </div>
        <p className="gp-gift-card__reason">{gift.reason}</p>
        <div className="gp-gift-card__bar">
          <div className="gp-gift-card__bar-fill" style={{ width: `${gift.match_score}%` }} />
        </div>
        <div className="gp-gift-card__score">匹配度 {gift.match_score}%</div>
        <button
          className="gp-btn gp-btn--primary gp-btn--block"
          onClick={() => onPick?.(gift.id)}
        >
          一键生成 →
        </button>
      </div>
    </div>
  );
}
