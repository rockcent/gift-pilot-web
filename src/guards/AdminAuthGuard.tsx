import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface AdminAuthGuardProps {
  children: ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const session = typeof window !== 'undefined' ? localStorage.getItem('gp-admin-session') : null;
  const location = useLocation();

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
