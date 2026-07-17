import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, isExpired, handleExpiredSession } from '../services/admin-auth';

export interface AdminAuthGuardProps {
  children: ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const session = getSession();
  const location = useLocation();

  if (isExpired(session)) {
    if (session) {
      /* session 存在但已过期 → 写 audit + 清 session + 跳 login */
      handleExpiredSession(location.pathname);
    }
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
