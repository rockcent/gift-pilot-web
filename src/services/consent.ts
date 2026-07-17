/* 礼有方网页端 · 隐私同意管理服务
 *
 * 基于 PRD §5.3 + §11 R-02（GDPR / PIPL 合规前置）：
 *   - 分项同意（必要 / 分析 / 营销）
 *   - 撤回硬保证（清 consent + 清 memory）
 *   - audit 留痕
 *
 * 阶段三接服务端时，把 consent 同步到用户档案即可。
 */
import { persistLocal, loadLocal, removeLocal, getDeviceInfo } from './storage';
import { writeAudit } from '../audit/audit-log';

export const CONSENT_KEY = 'consent:v1';
export const CONSENT_VERSION = '1.0.0'; // 法律版本号 — 隐私政策更新时升级

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentRecord {
  version: string;            // 隐私政策版本
  acceptedAt: number;         // 接受时间戳
  deviceId: string;           // 接受时的 deviceId
  choices: Record<ConsentCategory, boolean>; // 分项选择
  source: 'banner' | 'settings'; // 同意来源
}

const DEFAULT_CONSENT: ConsentRecord | null = null;

export function loadConsent(): ConsentRecord | null {
  return loadLocal<ConsentRecord | null>(CONSENT_KEY, DEFAULT_CONSENT);
}

export function hasConsented(): boolean {
  const c = loadConsent();
  if (!c) return false;
  // 版本过期视为未同意（律师定新版时升级 CONSENT_VERSION）
  return c.version === CONSENT_VERSION;
}

export interface AcceptConsentInput {
  choices: Record<ConsentCategory, boolean>;
  source: 'banner' | 'settings';
}

export function acceptConsent(input: AcceptConsentInput): ConsentRecord {
  const device = getDeviceInfo();
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    acceptedAt: Date.now(),
    deviceId: device.deviceId,
    choices: {
      // 必要项不可关闭 — GDPR Art. 6(1)(b) 合同必要
      necessary: true,
      analytics: !!input.choices.analytics,
      marketing: !!input.choices.marketing
    },
    source: input.source
  };
  persistLocal(CONSENT_KEY, record);

  writeAudit({
    action: 'consent.accept',
    target: CONSENT_KEY,
    meta: {
      version: record.version,
      choices: record.choices,
      source: record.source,
      deviceId: device.deviceId
    }
  });

  return record;
}

export function withdrawConsent(): void {
  const previous = loadConsent();
  removeLocal(CONSENT_KEY);

  if (previous) {
    writeAudit({
      action: 'consent.withdraw',
      target: CONSENT_KEY,
      meta: {
        previousVersion: previous.version,
        previousChoices: previous.choices,
        deviceId: previous.deviceId
      }
    });
  }
}

export interface ExportedData {
  exportedAt: number;
  exportedAtIso: string;
  exportVersion: '1.0.0';
  dataSubject: string;
  consent: ConsentRecord | null;
  memory: unknown;
  device: { deviceId: string; deviceLabel: string };
  source: 'web';
}

export function exportAllData(): ExportedData {
  const memory = loadLocal('memory', null);
  const consent = loadConsent();
  const device = getDeviceInfo();

  const payload: ExportedData = {
    exportedAt: Date.now(),
    exportedAtIso: new Date().toISOString(),
    exportVersion: '1.0.0',
    dataSubject: device.deviceId,
    consent,
    memory,
    device: { deviceId: device.deviceId, deviceLabel: device.deviceLabel },
    source: 'web'
  };

  writeAudit({
    action: 'data.export',
    target: 'all',
    meta: { deviceId: device.deviceId, exportVersion: payload.exportVersion }
  });

  return payload;
}
