import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brand } from '../../components/user/Brand';

export function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123';
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === expected) {
      localStorage.setItem('gp-admin-session', JSON.stringify({ loginAt: Date.now() }));
      navigate(from);
    } else {
      setError('密码错误（MVP 阶段默认 admin123，详见 .env.example）');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--brand-bg)' }}>
      <form className="gp-card" style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Brand size="md" showSlogan={false} />
        </div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, textAlign: 'center' }}>管理后台登录</h1>
        <p className="gp-caption" style={{ margin: 0, textAlign: 'center' }}>MVP 阶段单一密码；阶段二起接 OAuth</p>
        <input
          type="password"
          placeholder="请输入管理员密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '12px 14px', border: '1px solid var(--brand-line)', borderRadius: 'var(--radius-pill)',
            fontSize: 15, background: 'var(--brand-bg)', outline: 'none'
          }}
          autoFocus
        />
        {error && <div style={{ color: 'var(--brand-coral)', fontSize: 13 }}>{error}</div>}
        <button type="submit" className="gp-btn gp-btn--primary gp-btn--block">登录</button>
        <a href="/" style={{ textAlign: 'center', fontSize: 13, color: 'var(--brand-muted)' }}>← 回到用户端</a>
      </form>
    </div>
  );
}
