import type { ContentPiece } from '../../types';
import './ContentCard.scss';

export interface ContentCardProps {
  content: ContentPiece;
  active?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onOptimize?: () => void;
}

export function ContentCard({ content, active = false, onCopy, onRegenerate, onOptimize }: ContentCardProps) {
  return (
    <div className={`gp-content-card ${active ? 'gp-content-card--active' : ''}`}>
      <div className="gp-content-card__head">
        <span className="gp-pill gp-pill--green">{content.style_label}</span>
        <span className="gp-content-card__score">质量 {content.quality_score}</span>
      </div>
      <p className="gp-content-card__body">{content.body}</p>
      <div className="gp-content-card__tags">
        {content.tags.map((t) => (
          <span key={t} className="gp-pill gp-pill--apricot">#{t}</span>
        ))}
      </div>
      <div className="gp-content-card__ops">
        <button className="gp-content-card__op" onClick={onCopy}>📋 复制</button>
        <button className="gp-content-card__op" onClick={onRegenerate}>↻ 换一版</button>
        <button className="gp-content-card__op" onClick={onOptimize}>✨ 优化</button>
        <button className="gp-content-card__op">更多风格</button>
      </div>
    </div>
  );
}
