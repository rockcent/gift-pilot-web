/* 礼有方网页端 · 平台 storage helper
 *
 * 基于 @rockcent/platform/web-client 的 createStorage（v1.20.0+）：
 * - namespaced localStorage：避免与其他 app 冲突
 * - safeJsonParse 自动容错
 * - QuotaExceededError 软警告（不抛）
 * - SSR 友好（window 不存在时降级）
 *
 * 阶段三起接真实后端时，把 storage 调用替换为 API 调用即可。
 */
import { createStorage, safeJsonParse, getClientDeviceId, getClientDeviceLabel, getClientIdentityHeaders } from '@rockcent/platform/web-client';

const NAMESPACE = 'gift_pilot_web';

export const storage = typeof window !== 'undefined' ? createStorage(NAMESPACE) : null;

export function persistLocal<T>(key: string, value: T): boolean {
  if (!storage) return false;
  try {
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

export function loadLocal<T>(key: string, fallback: T): T {
  if (!storage) return fallback;
  try {
    const raw = storage.get<T | null>(key, null);
    return raw == null ? fallback : (raw as T);
  } catch {
    return fallback;
  }
}

export function removeLocal(key: string): void {
  if (!storage) return;
  try {
    storage.remove(key);
  } catch {
    /* 静默：清除失败不影响主流程 */
  }
}

export function clearLocalNamespace(): void {
  if (!storage) return;
  try {
    storage.clear();
  } catch {
    /* 静默 */
  }
}

/* ---------- 客户端身份（用于 audit 上报 + 设备识别） ---------- */

export function getDeviceInfo(): { deviceId: string; deviceLabel: string; headers: Record<string, string> } {
  return {
    deviceId: getClientDeviceId(),
    deviceLabel: getClientDeviceLabel(),
    headers: getClientIdentityHeaders()
  };
}

/* ---------- raw string 读写（兼容旧 localStorage 调用） ---------- */

export function readRawString(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRawString(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeRawString(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* 静默 */
  }
}

/* re-export platform primitives 给 admin / audit / pages 用 */
export { safeJsonParse };
