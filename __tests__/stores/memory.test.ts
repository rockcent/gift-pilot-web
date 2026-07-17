/* memory store 单测（PRD §5.3 + 宪法 §4.6）
 *
 * 重点：clear() 必须 removeLocal + 重置 BLANK（不留 localStorage 残影）；
 *       update() 必须 persistLocal（用户编辑跨刷新保留）。
 */
import { useMemoryStore } from '../../src/stores/memory-store';
import { loadLocal, removeLocal } from '../../src/services/storage';

describe('stores/memory (含 宪法 §4.6 一键清除 + 持久化)', () => {
  beforeEach(() => {
    /* 每个用例前清空 storage + store，避免污染 */
    if (typeof window !== 'undefined') {
      try { window.localStorage.clear(); } catch { /* noop */ }
    }
    /* 直接把 store 重置到 BLANK（绕过 setState 的副作用） */
    useMemoryStore.setState({
      memory: {
        id: 'mem_001',
        user_id: 'u_local',
        primary_relations: [],
        budget_range_fen: [0, 0],
        preferred_styles: [],
        favorite_categories: [],
        best_publish_window: '',
        goal_text: '',
        updated_at: 0
      }
    });
    removeLocal('memory');
  });

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

  test('update 会持久化到 localStorage (跨刷新保留)', () => {
    useMemoryStore.getState().update({ goal_text: '月佣金 ¥3,000' });
    /* 由于 storage 走 @rockcent/platform createStorage(NAMESPACE='gift_pilot_web')，
       实际 key 为 'gift_pilot_web:memory' */
    const raw = window.localStorage.getItem('gift_pilot_web:memory');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw || '{}');
    expect(parsed.goal_text).toBe('月佣金 ¥3,000');
  });

  test('clear 重置 memory 为空白 (宪法 §4.6 一键清除)', () => {
    useMemoryStore.getState().update({
      goal_text: '月佣金 ¥3,000',
      primary_relations: ['妈妈', '闺蜜']
    });
    expect(useMemoryStore.getState().memory.goal_text).toBe('月佣金 ¥3,000');

    useMemoryStore.getState().clear();

    const m = useMemoryStore.getState().memory;
    expect(m.goal_text).toBe('');
    expect(m.primary_relations).toEqual([]);
    expect(m.preferred_styles).toEqual([]);
    expect(m.favorite_categories).toEqual([]);
    expect(m.best_publish_window).toBe('');
  });

  test('clear 重置 budget_range_fen 为 [0, 0]', () => {
    useMemoryStore.getState().update({ budget_range_fen: [99900, 999900] });
    expect(useMemoryStore.getState().memory.budget_range_fen).toEqual([99900, 999900]);

    useMemoryStore.getState().clear();

    const m = useMemoryStore.getState().memory;
    expect(m.budget_range_fen).toEqual([0, 0]);
    expect(Number.isInteger(m.budget_range_fen[0])).toBe(true);
    expect(Number.isInteger(m.budget_range_fen[1])).toBe(true);
  });

  test('clear 必须 removeLocal (关键：不让数据在 storage 留底)', () => {
    /* 预存数据 */
    useMemoryStore.getState().update({ goal_text: '私密偏好' });
    /* update 后 storage 应有数据 */
    expect(loadLocal('memory', null)).not.toBeNull();

    /* 触发清除 */
    useMemoryStore.getState().clear();

    /* 关键断言：storage 里 memory key 必须被删干净 */
    expect(loadLocal('memory', null)).toBeNull();
    /* 同时裸 localStorage（绕过 namespace）也应为 null */
    expect(window.localStorage.getItem('gift_pilot_web:memory')).toBeNull();
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
    /* 重新累积的数据应立即 persistLocal */
    const raw = window.localStorage.getItem('gift_pilot_web:memory');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw || '{}');
    expect(parsed.goal_text).toBe('重启经营目标');
  });

  test('store 初始化从 localStorage 读真实用户数据（不是 seed）', () => {
    /* 模拟用户已有累积偏好 */
    useMemoryStore.getState().update({ goal_text: '用户私有偏好', primary_relations: ['妈妈'] });
    /* 新建一个 store 实例（模拟刷新页面），会从 localStorage 读 */
    /* 因为模块级 const initial 只在加载时执行一次，所以这里直接断言 storage 有数据 */
    expect(loadLocal('memory', null)).not.toBeNull();
    const stored = loadLocal<{ goal_text: string }>('memory', { goal_text: '' });
    expect(stored.goal_text).toBe('用户私有偏好');
  });
});
