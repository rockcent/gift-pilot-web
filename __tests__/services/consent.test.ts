/* consent service 单测（GDPR Art. 7 + Art. 15 + Art. 17） */
import {
  acceptConsent,
  hasConsented,
  loadConsent,
  withdrawConsent,
  exportAllData,
  CONSENT_KEY,
  CONSENT_VERSION
} from '../../src/services/consent';
import { persistLocal } from '../../src/services/storage';

describe('services/consent', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      try { window.localStorage.clear(); } catch { /* noop */ }
    }
  });

  test('hasConsented: false initially', () => {
    expect(hasConsented()).toBe(false);
    expect(loadConsent()).toBeNull();
  });

  test('acceptConsent: writes record with necessary=true, source=banner', () => {
    const rec = acceptConsent({
      choices: { necessary: true, analytics: true, marketing: true },
      source: 'banner'
    });
    expect(rec.version).toBe(CONSENT_VERSION);
    expect(rec.choices.necessary).toBe(true);
    expect(rec.choices.analytics).toBe(true);
    expect(rec.choices.marketing).toBe(true);
    expect(rec.source).toBe('banner');
    expect(rec.deviceId).toBeTruthy();
    expect(typeof rec.acceptedAt).toBe('number');
    expect(hasConsented()).toBe(true);
  });

  test('acceptConsent: necessary 不可关闭（即使传 false 也强制 true）', () => {
    const rec = acceptConsent({
      choices: { necessary: false as never, analytics: false, marketing: false },
      source: 'banner'
    });
    expect(rec.choices.necessary).toBe(true);
  });

  test('withdrawConsent: 清掉 consent key', () => {
    acceptConsent({
      choices: { necessary: true, analytics: true, marketing: true },
      source: 'banner'
    });
    expect(hasConsented()).toBe(true);
    withdrawConsent();
    expect(hasConsented()).toBe(false);
    expect(loadConsent()).toBeNull();
  });

  test('exportAllData: 包含 consent + memory + device,exportVersion=1.0.0', () => {
    acceptConsent({
      choices: { necessary: true, analytics: true, marketing: false },
      source: 'settings'
    });
    persistLocal('memory', { primary_relations: ['test'], budget_range_fen: [100, 200] });

    const data = exportAllData();
    expect(data.exportVersion).toBe('1.0.0');
    expect(data.source).toBe('web');
    expect(data.consent).not.toBeNull();
    expect(data.consent!.version).toBe(CONSENT_VERSION);
    expect(data.memory).toEqual({ primary_relations: ['test'], budget_range_fen: [100, 200] });
    expect(data.device.deviceId).toBeTruthy();
    expect(data.device.deviceLabel).toBeTruthy();
    expect(typeof data.exportedAt).toBe('number');
    expect(data.exportedAtIso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('exportAllData: 同意记录为 null 时也能导出（不报错）', () => {
    const data = exportAllData();
    expect(data.consent).toBeNull();
    expect(data.memory).toBeNull();
  });

  test('audit 写入: accept/withdraw/export 都产生 audit entry', () => {
    acceptConsent({
      choices: { necessary: true, analytics: false, marketing: false },
      source: 'banner'
    });
    withdrawConsent();
    exportAllData();
    const audit = JSON.parse(localStorage.getItem('gift_pilot_web:admin-audit') || '[]');
    const actions = audit.map((a: { action: string }) => a.action);
    expect(actions).toContain('consent.accept');
    expect(actions).toContain('consent.withdraw');
    expect(actions).toContain('data.export');
  });
});
