/* storage helper 单测（基于 @rockcent/platform/web-client v1.20.0） */
import { persistLocal, loadLocal, removeLocal, clearLocalNamespace, getDeviceInfo, safeJsonParse } from '../../src/services/storage';

describe('services/storage', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      try { window.localStorage.clear(); } catch { /* noop */ }
    }
  });

  test('persistLocal + loadLocal: roundtrip JSON object', () => {
    const data = { a: 1, b: ['x', 'y'], c: { nested: true } };
    expect(persistLocal('test-obj', data)).toBe(true);
    expect(loadLocal('test-obj', null)).toEqual(data);
  });

  test('loadLocal fallback when missing', () => {
    expect(loadLocal('not-exist', { default: 42 })).toEqual({ default: 42 });
  });

  test('removeLocal clears key', () => {
    persistLocal('to-remove', { v: 1 });
    expect(loadLocal('to-remove', null)).toEqual({ v: 1 });
    removeLocal('to-remove');
    expect(loadLocal('to-remove', null)).toBeNull();
  });

  test('clearLocalNamespace clears all', () => {
    persistLocal('k1', 1);
    persistLocal('k2', 2);
    clearLocalNamespace();
    expect(loadLocal('k1', null)).toBeNull();
    expect(loadLocal('k2', null)).toBeNull();
  });

  test('getDeviceInfo returns deviceId + deviceLabel + headers', () => {
    const info = getDeviceInfo();
    expect(typeof info.deviceId).toBe('string');
    expect(info.deviceId.length).toBeGreaterThan(0);
    expect(typeof info.deviceLabel).toBe('string');
    expect(typeof info.headers).toBe('object');
  });

  test('safeJsonParse handles malformed JSON gracefully', () => {
    expect(safeJsonParse('not-json', { fallback: true })).toEqual({ fallback: true });
    expect(safeJsonParse('{"a":1}', { fallback: true })).toEqual({ a: 1 });
    expect(safeJsonParse('', { fallback: true })).toEqual({ fallback: true });
    expect(safeJsonParse(null, { fallback: true })).toEqual({ fallback: true });
  });

  test('storage is namespaced under gift_pilot_web', () => {
    persistLocal('namespaced-test', 'value');
    // 平台 storage 写 key 时加前缀 gift_pilot_web:namespaced-test
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('gift_pilot_web:namespaced-test');
      expect(raw).not.toBeNull();
    }
  });
});
