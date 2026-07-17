import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brand } from '../components/user/Brand';

const NAV = [
  { to: '/admin', label: '仪表盘', icon: '📊', end: true },
  { to: '/admin/gifts', label: '商品管理', icon: '🎁' },
  { to: '/admin/orders', label: '订单管理', icon: '📋' },
  { to: '/admin/users', label: '用户管理', icon: '👥' },
  { to: '/admin/content', label: '内容审核', icon: '✨' },
  { to: '/admin/memory', label: 'AI 记忆审核', icon: '🧠' },
  { to: '/admin/finance', label: '财务概览', icon: '💰' }
];

const TITLE_MAP: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/gifts': '商品管理',
  '/admin/orders': '订单管理',
  '/admin/users': '用户管理',
  '/admin/content': '内容审核',
  '/admin/memory': 'AI 记忆审核',
  '/admin/finance': '财务概览'
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = TITLE_MAP[location.pathname] || '管理后台';

  const onLogout = async () => {
    const { clearSession, reportAdminAction } = await import('../services/admin-auth');
    void reportAdminAction('AUTH_LOGOUT', 'admin-session');
    clearSession();
    navigate('/admin/login');
  };

  return (
    <div className="gp-admin">
      <aside className="gp-admin__sidebar">
        <div className="gp-admin__brand">
          <span className="gp-admin__brand-title">礼有方</span>
          <span className="gp-admin__brand-sub">ADMIN CONSOLE · MVP</span>
        </div>
        <nav className="gp-admin__nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                'gp-admin__nav-item' + (isActive ? ' gp-admin__nav-item--active' : '')
              }
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>登录身份</div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>admin</div>
          <button className="gp-btn gp-btn--ghost" style={{ width: '100%' }} onClick={onLogout}>
            退出登录
          </button>
        </div>
      </aside>

      <div className="gp-admin__main">
        <header className="gp-admin__topbar">
          <div className="gp-admin__topbar-title">{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="gp-pill gp-pill--green">Mock 数据</span>
            <a href="/" className="gp-pill gp-pill--ink" style={{ textDecoration: 'none' }}>
              ← 回到用户端
            </a>
          </div>
        </header>

        <main className="gp-admin__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
