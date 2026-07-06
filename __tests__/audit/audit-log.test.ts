import { writeAudit, readAudit, clearAudit, AuditEntry } from '../../src/audit/audit-log';

describe('audit/audit-log', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
  });

  test('writeAudit + readAudit roundtrip', () => {
    writeAudit({ action: 'gift_on', target: 'gft_001', meta: { title: '香氛礼盒' } });
    const list = readAudit();
    expect(list.length).toBe(1);
    expect(list[0]).toMatchObject({
      action: 'gift_on',
      target: 'gft_001',
      operator: 'admin',
      meta: { title: '香氛礼盒' }
    });
    expect(typeof list[0].ts).toBe('number');
  });

  test('writeAudit keeps max 500 entries (FIFO)', () => {
    for (let i = 0; i < 502; i++) writeAudit({ action: 'test', target: `t_${i}` });
    const list = readAudit();
    expect(list.length).toBe(500);
    // 最早的应该被截掉
    expect(list[0].target).toBe('t_2');
    expect(list[499].target).toBe('t_501');
  });

  test('clearAudit empties storage', () => {
    writeAudit({ action: 'a', target: 'x' });
    expect(readAudit().length).toBe(1);
    clearAudit();
    expect(readAudit().length).toBe(0);
  });
});
