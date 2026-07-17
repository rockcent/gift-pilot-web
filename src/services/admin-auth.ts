/* 管理后台鉴权（最小加固）· v1.20.0 起
 *
 * 宪法 §6.8: 阶段二起 admin 路由必须挂真实鉴权中间件；本服务是"最小加固"，
 * 不接 OAuth（B-02 PM 拍板选型），仅做：
 *   1. session 加 30 分钟过期
 *   2. 过期自动跳 login
 *   3. audit 上报（mock /api/audit 端点，阶段二切真实）
 *
 * §6.8 红线：admin **永远不可**直接修改用户 AI 记忆（仅可标记「需复审」）。
 * 本服务不触碰 MemoryAuditPage 的"标记 + 不可编辑"行为。
 */
import { getClientIdentityHeaders } from '@rockcent/platform/web-client';
import { writeRawString, readRawString, removeRawString } from './storage';
import { writeAudit } from '../audit/audit-log';

const SESSION_KEY = 'gift_pilot_web:admin-session';
const SESSION_TTL_MS = 30 * 60 * 1000; /* 30 分钟 */

export interface AdminSession {
  token: string;
  loginAt: number;
  expiresAt: number;
  role: 'admin';
}

export function createSession(): AdminSession {
  const now = Date.now();
  return {
    token: `admin_${now}_${Math.random().toString(36).slice(2, 10)}`,
    loginAt: now,
    expiresAt: now + SESSION_TTL_MS,
    role: 'admin'
  };
}

export function persistSession(session: AdminSession): void {
  writeRawString(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AdminSession | null {
  const raw = readRawString(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (typeof parsed.expiresAt !== 'number' || typeof parsed.token !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  removeRawString(SESSION_KEY);
}

export function isExpired(session: AdminSession | null): boolean {
  if (!session) return true;
  return Date.now() >= session.expiresAt;
}

/* ---------- audit 上报（mock /api/audit 端点，失败不阻塞主流程） ---------- */

export async function reportAdminAction(action: string, target: string, meta?: Record<string, unknown>): Promise<void> {
  writeAudit({ action, target, meta });
  if (typeof window === 'undefined') return;
  try {
    const deviceHeaders = getClientIdentityHeaders();
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...deviceHeaders },
      body: JSON.stringify({ action, target, meta: meta ?? {}, ts: Date.now() }),
      keepalive: true
    });
  } catch {
    /* 静默：阶段二接云开发 / pay-core 后会自动可观测 */
  }
}

/* ---------- 写过期审计 + 跳 login ---------- */

export function handleExpiredSession(fromPath: string): void {
  writeAudit({ action: 'AUTH_EXPIRED', target: 'admin-session', meta: { from: fromPath } });
  void reportAdminAction('AUTH_EXPIRED', 'admin-session', { from: fromPath });
  clearSession();
}
