/* 礼有方网页端 · 隐私设置页（GDPR Art. 7(3) 撤回同意）
 *
 * 功能：
 *   - 显示当前 consent 记录（版本/时间/分项）
 *   - 撤回全部同意：清 consent + 触发全数据清除（保留 deviceId 给 audit）
 *   - 跳转 /memory 调整记忆
 */
import { useEffect, useState } from 'react';
import {
  loadConsent,
  withdrawConsent,
  exportAllData,
  type ConsentRecord
} from '../../services/consent';
import { useMemoryStore } from '../../stores/memory-store';

export function PrivacySettingsPage() {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const clearMemory = useMemoryStore((s) => s.clear);

  const refresh = () => setConsent(loadConsent());

  useEffect(() => {
    refresh();
  }, []);

  const onWithdraw = () => {
    if (!window.confirm('撤回同意将清除您的 AI 记忆和同意记录。此操作不可恢复。是否继续？')) return;
    withdrawConsent();
    clearMemory(); // 同时清掉 memory（GDPR Art. 17 删除权）
    refresh();
    window.alert('✅ 已撤回同意，AI 记忆已清除');
  };

  const onExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giftpilot-data-export-${data.exportedAt}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gp-legal-page">
      <header style={{ marginBottom: 16 }}>
        <h1 className="gp-h1">隐私设置</h1>
        <p className="gp-caption">GDPR Art. 7(3) 撤回同意 · Art. 15 数据访问 · Art. 17 删除权</p>
      </header>

      <section className="gp-legal-section">
        <h2>当前同意状态</h2>
        {consent ? (
          <div className="gp-legal-card">
            <p><strong>隐私政策版本</strong>：<code>{consent.version}</code></p>
            <p><strong>接受时间</strong>：{new Date(consent.acceptedAt).toLocaleString('zh-CN')}</p>
            <p><strong>来源</strong>：{consent.source === 'banner' ? '首次访问横幅' : '本设置页'}</p>
            <p><strong>分项选择</strong>：</p>
            <ul>
              <li>必要：{consent.choices.necessary ? '✅' : '❌'}</li>
              <li>分析：{consent.choices.analytics ? '✅' : '❌'}</li>
              <li>营销：{consent.choices.marketing ? '✅' : '❌'}</li>
            </ul>
          </div>
        ) : (
          <p className="gp-caption">尚未记录同意（首次访问时会出现同意横幅）。</p>
        )}
      </section>

      <section className="gp-legal-section">
        <h2>我的权利</h2>
        <div className="gp-legal-actions">
          <button className="gp-btn gp-btn--primary" onClick={onExport} data-testid="export-data-btn">
            📦 导出我的全部数据（JSON）
          </button>
          <button className="gp-btn gp-btn--ghost" onClick={onWithdraw} data-testid="withdraw-btn">
            🚫 撤回全部同意 + 清除记忆
          </button>
          <a className="gp-btn gp-btn--secondary" href="/memory">📝 编辑 AI 记忆</a>
        </div>
      </section>

      <section className="gp-legal-section">
        <h2>相关文档</h2>
        <ul>
          <li><a href="/legal/privacy.html" target="_blank" rel="noreferrer">隐私政策</a></li>
          <li><a href="/legal/terms.html" target="_blank" rel="noreferrer">用户协议</a></li>
          <li><a href="/legal/cookies.html" target="_blank" rel="noreferrer">Cookie 政策</a></li>
        </ul>
      </section>
    </div>
  );
}
