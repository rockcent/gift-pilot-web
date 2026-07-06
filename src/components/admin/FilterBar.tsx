import { ReactNode } from 'react';
import './FilterBar.scss';

export interface FilterBarProps {
  children?: ReactNode;
  right?: ReactNode;
}

export function FilterBar({ children, right }: FilterBarProps) {
  return (
    <div className="gp-filter-bar">
      <div className="gp-filter-bar__left">{children}</div>
      <div className="gp-filter-bar__right">{right}</div>
    </div>
  );
}
