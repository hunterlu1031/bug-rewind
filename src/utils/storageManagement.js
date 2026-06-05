import {
  APP_STORAGE_KEYS,
  DEFAULT_CLEAR_OLD_DAYS,
  ESTIMATED_STORAGE_LIMIT_BYTES,
  STORAGE_PERCENT_CRITICAL,
  STORAGE_PERCENT_DANGER,
  STORAGE_PERCENT_WARNING,
} from '../constants/storageManagement';
import { loadBugs, saveBugs } from '../services/bugStorage';
import { TEST_RUNS_CHANGED_EVENT } from '../services/storageService';
import { formatBytes } from './storageSize';

function getKeyStorageSize(key) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return 0;
    return new Blob([data]).size;
  } catch {
    return 0;
  }
}

export function getUsageTier(percent) {
  if (percent >= STORAGE_PERCENT_CRITICAL) return 'critical';
  if (percent >= STORAGE_PERCENT_DANGER) return 'danger';
  if (percent >= STORAGE_PERCENT_WARNING) return 'warning';
  return 'ok';
}

const TIER_STYLES = {
  ok: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
    banner: 'border-stripe-border bg-stripe-bg text-stripe-muted',
  },
  warning: {
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    bar: 'bg-amber-500',
    banner: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  danger: {
    dot: 'bg-orange-500',
    text: 'text-orange-800',
    bar: 'bg-orange-500',
    banner: 'border-orange-300 bg-orange-50 text-orange-900',
  },
  critical: {
    dot: 'bg-red-500',
    text: 'text-red-800',
    bar: 'bg-red-500',
    banner: 'border-red-300 bg-red-50 text-red-900',
  },
};

export function getTierStyles(tier) {
  return TIER_STYLES[tier] || TIER_STYLES.ok;
}

export function getAppStorageBreakdown() {
  return APP_STORAGE_KEYS.map((key) => {
    const bytes = getKeyStorageSize(key);
    return { key, bytes, label: formatBytes(bytes) };
  }).filter((item) => item.bytes > 0);
}

function getBugsStorageBytes() {
  return Math.max(
    getKeyStorageSize('bug-rewind-bugs'),
    getKeyStorageSize('qa_bugs'),
  );
}

export function getAppStorageUsage(limitBytes = ESTIMATED_STORAGE_LIMIT_BYTES) {
  const breakdown = getAppStorageBreakdown();
  const bugsBytes = getBugsStorageBytes();
  const testRunsBytes = getKeyStorageSize('qa_test_runs');
  const totalBytes = bugsBytes + testRunsBytes;
  const percent = limitBytes > 0
    ? Math.min(100, Math.round((totalBytes / limitBytes) * 100))
    : 0;
  const tier = getUsageTier(percent);

  return {
    totalBytes,
    limitBytes,
    percent,
    tier,
    breakdown,
    styles: getTierStyles(tier),
    label: `${formatBytes(totalBytes)} / ${formatBytes(limitBytes)}`,
    showBanner: percent >= STORAGE_PERCENT_WARNING,
    blockImages: percent >= STORAGE_PERCENT_DANGER,
  };
}

/** Shape compatible with existing storage UI consumers. */
export function getAppStorageUsageInfo() {
  const usage = getAppStorageUsage();
  const levelMap = { ok: 'green', warning: 'yellow', danger: 'orange', critical: 'red' };

  return {
    bytes: usage.totalBytes,
    limitBytes: usage.limitBytes,
    percent: usage.percent,
    tier: usage.tier,
    level: levelMap[usage.tier] || 'green',
    styles: usage.styles,
    label: usage.label,
    isWarning: usage.showBanner,
    blockImages: usage.blockImages,
    isCritical: usage.tier === 'critical',
  };
}

function notifyTestRunsChanged() {
  window.dispatchEvent(new Event(TEST_RUNS_CHANGED_EVENT));
}

export function refreshStorageMetricsSnapshot() {
  return getAppStorageUsage();
}

export function clearAllAppData() {
  for (const key of APP_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
  notifyTestRunsChanged();
  return { clearedKeys: [...APP_STORAGE_KEYS] };
}

export function stripScreenshotsFromBugs(bugs) {
  if (!Array.isArray(bugs)) return [];
  return bugs.map((bug) => ({
    ...bug,
    attachments: [],
    replaySteps: (bug.replaySteps || []).map((step) => {
      if (!step || typeof step !== 'object') return step;
      const { screenshot, ...rest } = step;
      return rest;
    }),
  }));
}

export function clearScreenshotsOnly() {
  const bugs = loadBugs();
  const cleaned = stripScreenshotsFromBugs(bugs);
  saveBugs(cleaned);
  return {
    bugsUpdated: cleaned.length,
    bytesBefore: getKeyStorageSize('bug-rewind-bugs') + getKeyStorageSize('qa_bugs'),
  };
}

export function clearOldBugs(daysOld = DEFAULT_CLEAR_OLD_DAYS) {
  const bugs = loadBugs();
  const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;

  const kept = bugs.filter((bug) => {
    const created = new Date(bug.createdAt || 0).getTime();
    if (Number.isNaN(created)) return true;
    return created >= cutoff;
  });

  const removed = bugs.length - kept.length;
  saveBugs(kept);

  return { removed, remaining: kept.length, daysOld };
}
