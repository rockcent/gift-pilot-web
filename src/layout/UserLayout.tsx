import { NavLink, Outlet, Link } from 'react-router-dom';
import { Brand } from '../components/user/Brand';
import { AISixBanner } from '../components/user/AISixBanner';
import { ConsentBanner } from '../components/compliance/ConsentBanner';
import './UserLayout.scss';

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/recommend', label: '推荐' },
  { to: '/content', label: '内容' },
  { to: '/orders', label: '订单' },
  { to: '/review', label: '复盘' },
  { to: '/memory', label: '我的' }
];

export function UserLayout() {
  return (
    <div className="gp-user-layout">
      <header className="gp-user-layout__top">
        <div className="gp-user-layout__brand">
          <Brand size="sm" showSlogan={false} />
          <span className="gp-user-layout__slogan">送礼有方，推荐有数。</span>
        </div>
        <nav className="gp-user-layout__nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                'gp-user-layout__nav-link' + (isActive ? ' gp-user-layout__nav-link--active' : '')
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="gp-user-layout__nav-link gp-user-layout__nav-link--admin">
            管理后台
          </Link>
        </nav>
      </header>

      <main className="gp-user-layout__main">
        <Outlet />
      </main>

      <div className="gp-user-layout__six">
        <AISixBanner />
      </div>

      <footer className="gp-user-layout__footer">
        <Brand size="sm" showSlogan={false} />
        <p className="gp-mini">礼有方 · AI 礼物经营助手 · 送礼有方，推荐有数。</p>
        <p className="gp-mini">
          <Link to="/privacy/settings">隐私设置</Link>
          {' · '}
          <a href="/legal/privacy.html" target="_blank" rel="noreferrer">隐私政策</a>
          {' · '}
          <a href="/legal/terms.html" target="_blank" rel="noreferrer">用户协议</a>
          {' · '}
          <a href="/legal/cookies.html" target="_blank" rel="noreferrer">Cookie 政策</a>
          {' · '}
          © 2026 GiftPilot · MVP v0.6
        </p>
      </footer>
      <ConsentBanner />
    </div>
  );
}
