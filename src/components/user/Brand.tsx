import './Brand.scss';

export interface BrandProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export function Brand({ size = 'md', showSlogan = false }: BrandProps) {
  return (
    <div className={`gp-brand gp-brand--${size}`}>
      <div className="gp-brand__logo" />
      <div>
        <div className="gp-brand__title">礼有方</div>
        <div className="gp-brand__sub">GiftPilot</div>
      </div>
      {showSlogan && <div className="gp-brand__slogan">送礼有方，推荐有数。</div>}
    </div>
  );
}
