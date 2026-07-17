/* 管理后台操作日志 · v1.20.0 起走 @rockcent/platform/web-client storage
 *
 * MVP 阶段存 localStorage（namespace gift_pilot_web），阶段二切云数据库。
 * 接入平台 storage 的好处：
 *   - namespaced key 避免与其他 app 冲突
 *   - QuotaExceededError 软警告（不抛）
 *   - safeJsonParse 自动容错
 */
import { persistLocal, loadLocal } from '../services/storage';

export interface AuditEntry {
  id: string;
  action: string;
  target: string;
  operator: string;
  ts: number;
  meta?: Record<string, unknown>;
}

const STORAGE_KEY = 'admin-audit';
const MAX_ENTRIES = 500;

export function writeAudit(entry: Omit<AuditEntry, 'id' | 'ts' | 'operator'>): void {
  if (typeof window === 'undefined') return;
  const list = readAudit();
  const newEntry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    ts: Date.now(),
    operator: 'admin',
    ...entry
  };
  list.push(newEntry);
  const trimmed = list.slice(-MAX_ENTRIES);
  persistLocal(STORAGE_KEY, trimmed);
}

export function readAudit(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  return loadLocal<AuditEntry[]>(STORAGE_KEY, []);
}

export function clearAudit(): void {
  if (typeof window === 'undefined') return;
  persistLocal(STORAGE_KEY, []);
}
