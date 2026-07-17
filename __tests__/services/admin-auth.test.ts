/* admin-auth 单测（宪法 §6.8 最小加固） */
import {
  createSession,
  persistSession,
  getSession,
  clearSession,
  isExpired,
  reportAdminAction,
  handleExpiredSession
} from '../../src/services/admin-auth';
import { readAudit, clearAudit } from '../../src/audit/audit-log';

describe('services/admin-auth (宪法 §6.8 最小加固)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      try { window.localStorage.clear(); } catch { /* noop */ }
    }
    clearAudit();
  });

  test('createSession 返回带 expiresAt 的 30 分钟 session', () => {
    const s = createSession();
    expect(s.role).toBe('admin');
    expect(typeof s.token).toBe('string');
    expect(s.token.length).toBeGreaterThan(0);
    expect(s.expiresAt - s.loginAt).toBe(30 * 60 * 1000);
  });

  test('persistSession + getSession roundtrip', () => {
    const s = createSession();
    persistSession(s);
    const got = getSession();
    expect(got).not.toBeNull();
    expect(got?.token).toBe(s.token);
    expect(got?.expiresAt).toBe(s.expiresAt);
  });

  test('clearSession 清空 session', () => {
    persistSession(createSession());
    expect(getSession()).not.toBeNull();
    clearSession();
    expect(getSession()).toBeNull();
  });

  test('isExpired null session → true', () => {
    expect(isExpired(null)).toBe(true);
  });

  test('isExpired 新建 session → false', () => {
    expect(isExpired(createSession())).toBe(false);
  });

  test('isExpired 过期 session → true', () => {
    const s = createSession();
    s.expiresAt = Date.now() - 1000;
    expect(isExpired(s)).toBe(true);
  });

  test('getSession 损坏 JSON → null', () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gift_pilot_web:admin-session', '{not json');
    }
    expect(getSession()).toBeNull();
  });

  test('reportAdminAction 写本地 audit + 异步 fetch（不阻塞）', async () => {
    const before = readAudit().length;
    await reportAdminAction('TEST_ACTION', 'test_target', { foo: 'bar' });
    const after = readAudit().length;
    expect(after).toBe(before + 1);
    const last = readAudit()[readAudit().length - 1];
    expect(last.action).toBe('TEST_ACTION');
    expect(last.target).toBe('test_target');
    expect(last.meta).toEqual({ foo: 'bar' });
  });

  test('handleExpiredSession 写 AUTH_EXPIRED audit + 清 session', () => {
    persistSession(createSession());
    expect(getSession()).not.toBeNull();
    handleExpiredSession('/admin/dashboard');
    expect(getSession()).toBeNull();
    const audit = readAudit();
    const expired = audit.find((e) => e.action === 'AUTH_EXPIRED');
    expect(expired).toBeDefined();
    expect(expired?.meta?.from).toBe('/admin/dashboard');
  });
});
