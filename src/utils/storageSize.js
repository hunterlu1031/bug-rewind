import { QA_BUGS_STORAGE_KEY } from '../services/bugStorage';
import {
  STORAGE_BLOCK_IMAGE_BYTES,
  STORAGE_DISPLAY_LIMIT_BYTES,
  STORAGE_LEVEL_THRESHOLDS,
  STORAGE_WARNING_BYTES,
} from '../constants/storageLimits';

/**
 * Reads bug JSON from localStorage and returns byte size via Blob.
 * @param {string} [key] defaults to QA_BUGS_STORAGE_KEY
 */
export function getBugStorageSize(key = QA_BUGS_STORAGE_KEY) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return 0;
    return new Blob([data]).size;
  } catch {
    return 0;
  }
}

export function bytesToKB(bytes) {
  return bytes / 1024;
}

export function bytesToMB(bytes) {
  return bytes / (1024 * 1024);
}

export function formatBytes(bytes, decimals = 1) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${bytesToKB(bytes).toFixed(decimals)} KB`;
  return `${bytesToMB(bytes).toFixed(decimals)} MB`;
}

export function getStorageLevel(bytes) {
  if (bytes < STORAGE_LEVEL_THRESHOLDS.green) return 'green';
  if (bytes < STORAGE_LEVEL_THRESHOLDS.yellow) return 'yellow';
  if (bytes < STORAGE_LEVEL_THRESHOLDS.orange) return 'orange';
  return 'red';
}

const LEVEL_STYLES = {
  green: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
  yellow: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  orange: {
    dot: 'bg-orange-500',
    text: 'text-orange-700',
    bar: 'bg-orange-500',
  },
  red: {
    dot: 'bg-red-500',
    text: 'text-red-700',
    bar: 'bg-red-500',
  },
};

export function getStorageLevelStyles(level) {
  return LEVEL_STYLES[level] || LEVEL_STYLES.green;
}

export function isStorageWarning(bytes) {
  return bytes >= STORAGE_WARNING_BYTES;
}

export function shouldBlockImageUpload(bytes) {
  return bytes >= STORAGE_BLOCK_IMAGE_BYTES;
}

export function getStorageUsageInfo(bytes, limitBytes = STORAGE_DISPLAY_LIMIT_BYTES) {
  const level = getStorageLevel(bytes);
  const percent = Math.min(100, Math.round((bytes / limitBytes) * 100));

  return {
    bytes,
    kb: bytesToKB(bytes),
    mb: bytesToMB(bytes),
    limitBytes,
    level,
    styles: getStorageLevelStyles(level),
    percent,
    label: `${formatBytes(bytes)} / ${formatBytes(limitBytes)}`,
    isWarning: isStorageWarning(bytes),
    blockImages: shouldBlockImageUpload(bytes),
  };
}
