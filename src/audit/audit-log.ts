/* 管理后台操作日志（MVP mock 存 localStorage，阶段二切云数据库） */
export interface AuditEntry {
  id: string;
  action: string;
  target: string;
  operator: string;
  ts: number;
  meta?: Record<string, unknown>;
}

const STORAGE_KEY = 'gp-admin-audit';
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function readAudit(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearAudit(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
