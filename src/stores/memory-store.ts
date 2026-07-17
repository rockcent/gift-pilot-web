import { create } from 'zustand';
import type { AIMemory } from '../types';
import memorySeed from '../data/mock-memory.json';
import { loadLocal, persistLocal, removeLocal } from '../services/storage';

const STORAGE_KEY = 'memory';
/* 清除后回到空白态（PRD §5.3 + 宪法 §4.6「用户可一键清除 AI 记忆」）：
 *   - 所有可枚举字段清空
 *   - budget_range_fen 重置为 [0, 0]（保持整数对类型不变）
 *   - updated_at 重置为 0（表示尚未更新）
 *   - id / user_id 保留 seed 默认，便于后续重新累积
 */
const BLANK: AIMemory = {
  ...(memorySeed as AIMemory),
  primary_relations: [],
  budget_range_fen: [0, 0],
  preferred_styles: [],
  favorite_categories: [],
  best_publish_window: '',
  goal_text: '',
  updated_at: 0
};

interface MemoryState {
  memory: AIMemory;
  update: (patch: Partial<AIMemory>) => void;
  clear: () => void;
}

const initial: AIMemory = loadLocal<AIMemory>(STORAGE_KEY, memorySeed as AIMemory);

export const useMemoryStore = create<MemoryState>((set) => ({
  memory: initial,
  update: (patch) =>
    set((s) => {
      const next: AIMemory = { ...s.memory, ...patch, updated_at: Date.now() };
      persistLocal(STORAGE_KEY, next);
      return { memory: next };
    }),
  clear: () =>
    set(() => {
      /* 关键：必须 removeLocal + 重置为 BLANK，否则 PRD §5.3 名存实亡 */
      removeLocal(STORAGE_KEY);
      return { memory: { ...BLANK, updated_at: Date.now() } };
    })
}));
