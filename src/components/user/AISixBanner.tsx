import './AISixBanner.scss';

const ITEMS = [
  { dot: '选', label: '选对礼' },
  { dot: '谈', label: '谈得好' },
  { dot: '做', label: '做得美' },
  { dot: '发', label: '发得准' },
  { dot: '看', label: '看得清' },
  { dot: '改', label: '改得好' }
];

export function AISixBanner() {
  return (
    <div className="gp-ai6-banner">
      <div className="gp-ai6-banner__title">
        <span>AI 原生体验</span>
        <span className="gp-mini">从选礼到复盘，小礼帮���走完全链路</span>
      </div>
      <div className="gp-ai6-banner__grid">
        {ITEMS.map((it) => (
          <div key={it.label} className="gp-ai6-banner__item">
            <div className="gp-ai6-banner__dot">{it.dot}</div>
            <div className="gp-ai6-banner__label">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
