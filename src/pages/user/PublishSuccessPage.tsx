import { useNavigate } from 'react-router-dom';

export function PublishSuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px', textAlign: 'center', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-green), var(--brand-apricot))',
          color: '#fff', fontSize: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-float)'
        }}>✓</div>
        <h1 className="gp-h1">发布成功！</h1>
        <p className="gp-caption">你的内容已成功发布到朋友圈</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button className="gp-btn gp-btn--ghost gp-btn--block">查看发布内容</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="gp-btn gp-btn--ink" style={{ flex: 1 }}>分享给好友</button>
          <button className="gp-btn gp-btn--primary" style={{ flex: 1 }} onClick={() => navigate('/')}>继续生成</button>
        </div>
      </div>
    </div>
  );
}
