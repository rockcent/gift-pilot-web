/* API 客户端 · 真接入 @rockcent/platform/web-client (平台 v1.20.0+)
 *
 * MVP 阶段 ai/orders/memory 仍是 mock service（前端独立跑通 UI），
 * 但 createApiClient + createJsonClient 已真实接入平台，未来接通真实后端时
 * 仅替换 mock service 调用为 platform client.post/get 即可。
 *
 * 平台契约：
 *   - createApiClient({ baseUrl, getAuthToken, throwOnError, timeoutMs }) → fetch wrapper
 *   - createJsonClient(api) → { get, post<T> } 强类型 JSON 客户端
 *   - normalizeFetchError(status, body) → { code, message, status } 中文错误映射
 *   - getClientIdentityHeaders() → 注入 X-Rockcent-Device-* 头（设备识别）
 *   - safeJsonParse(raw, fallback) → 容错 JSON.parse
 */
import { createApiClient, createJsonClient, normalizeFetchError, getClientIdentityHeaders } from '@rockcent/platform/web-client';

export interface ApiResult<T> {
  ok: boolean;
  data: T | null;
  error: { code: string; message: string; status?: number } | null;
}

export interface ApiClient {
  ai: {
    ask: (query: string) => Promise<ApiResult<any>>;
    recommend: (relation: string, budgetFen: number, scene: string) => Promise<ApiResult<any>>;
    generateContent: (giftId: string, style: string) => Promise<ApiResult<any>>;
    generateCover: (giftId: string, style: string) => Promise<ApiResult<any>>;
    review: (userId: string) => Promise<ApiResult<any>>;
    nextPlan: (userId: string) => Promise<ApiResult<any>>;
  };
  orders: {
    list: (userId: string) => Promise<ApiResult<any>>;
  };
  memory: {
    get: (userId: string) => Promise<ApiResult<any>>;
    put: (userId: string, memory: any) => Promise<ApiResult<any>>;
  };
}

/* 平台 API client：MVP 阶段 baseUrl 指向 /api 暂未启用（后端阶段三建），
   仅作未来真实接入入口；当前 throwOnError=false 让 mock 短路时不会触发平台错误。 */
const platformApi = createApiClient({
  baseUrl: '/api',
  throwOnError: false,
  timeoutMs: 10000
});
export const jsonClient = createJsonClient(platformApi);

/* 平台错误映射（直接暴露给 UI 用） */
export function mapPlatformError(status: number, body?: unknown): { code: string; message: string } {
  return normalizeFetchError(status, body);
}

/* 平台身份头（出站 fetch 调用前注入；mock 阶段仅在 audit 上报时用） */
export function platformIdentityHeaders(): Record<string, string> {
  return getClientIdentityHeaders();
}

import { aiMock } from './ai/mock';
import ordersMockService from './orders/mock';
import memoryMockService from './memory/mock';

export const api: ApiClient = {
  ai: {
    ask: (query) => aiMock.ask(query) as any,
    recommend: (relation, budgetFen, scene) => aiMock.recommend({
      relation,
      budget_fen: budgetFen,
      scene,
      tone: 'warm',
      raw_query: ''
    }) as any,
    generateContent: (giftId, style) => aiMock.generateContent(giftId, style as any) as any,
    generateCover: (giftId, style) => aiMock.generateCover(giftId, style as any) as any,
    review: (userId) => aiMock.review(userId) as any,
    nextPlan: (userId) => aiMock.nextPlan(userId) as any
  },
  orders: { list: ordersMockService.list },
  memory: { get: memoryMockService.get, put: memoryMockService.put }
};
