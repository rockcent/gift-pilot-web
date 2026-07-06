import { ReactNode, useEffect } from 'react';
import './Drawer.scss';

export interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Drawer({ open, title, onClose, children, footer, width = 480 }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="gp-admin-drawer" onClick={onClose}>
      <div className="gp-admin-drawer__panel" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="gp-admin-drawer__head">
          <h3>{title}</h3>
          <button className="gp-admin-drawer__close" onClick={onClose}>×</button>
        </div>
        <div className="gp-admin-drawer__body">{children}</div>
        {footer && <div className="gp-admin-drawer__footer">{footer}</div>}
      </div>
    </div>
  );
}
