import { useMemoryStore } from '../../src/stores/memory-store';

describe('stores/memory (含 宪法 §4.6 一键清除)', () => {
  beforeEach(() => useMemoryStore.getState().clear());

  test('update budget_range_fen keeps integer pair', () => {
    useMemoryStore.getState().update({ budget_range_fen: [20000, 50000] });
    const m = useMemoryStore.getState().memory;
    expect(m.budget_range_fen).toEqual([20000, 50000]);
    expect(Number.isInteger(m.budget_range_fen[0])).toBe(true);
    expect(Number.isInteger(m.budget_range_fen[1])).toBe(true);
  });

  test('update goal_text updates text', () => {
    useMemoryStore.getState().update({ goal_text: '月佣金 ¥3,000' });
    expect(useMemoryStore.getState().memory.goal_text).toBe('月佣金 ¥3,000');
  });

  test('clear 重置 memory 为初始空白 seed (宪法 §4.6)', () => {
    useMemoryStore.getState().update({
      goal_text: '月佣金 ¥3,000',
      primary_relations: ['妈妈', '闺蜜']
    });
    expect(useMemoryStore.getState().memory.goal_text).toBe('月佣金 ¥3,000');

    useMemoryStore.getState().clear();

    const m = useMemoryStore.getState().memory;
    expect(m.goal_text).not.toBe('月佣金 ¥3,000');
    expect(Array.isArray(m.primary_relations)).toBe(true);
  });

  test('clear 重置 budget_range_fen 为初始值', () => {
    useMemoryStore.getState().update({ budget_range_fen: [99900, 999900] });
    expect(useMemoryStore.getState().memory.budget_range_fen).toEqual([99900, 999900]);

    useMemoryStore.getState().clear();

    const m = useMemoryStore.getState().memory;
    expect(m.budget_range_fen).not.toEqual([99900, 999900]);
    expect(Array.isArray(m.budget_range_fen)).toBe(true);
    expect(Number.isInteger(m.budget_range_fen[0])).toBe(true);
    expect(Number.isInteger(m.budget_range_fen[1])).toBe(true);
  });

  test('clear 刷新 updated_at 时间戳', async () => {
    const before = useMemoryStore.getState().memory.updated_at;
    await new Promise((r) => setTimeout(r, 5));
    useMemoryStore.getState().clear();
    const after = useMemoryStore.getState().memory.updated_at;
    expect(after).toBeGreaterThan(before);
  });

  test('clear 后立刻 update 仍正常工作', () => {
    useMemoryStore.getState().clear();
    useMemoryStore.getState().update({ goal_text: '重启经营目标' });
    expect(useMemoryStore.getState().memory.goal_text).toBe('重启经营目标');
  });
});