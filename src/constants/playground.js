export const PLAYGROUND_ROOT_ID = 'test-playground-root';
export const PLAYGROUND_PATH_PREFIX = '/playground';
export const PLAYGROUND_RETURN_KEY = 'playground-return-path';

export function isPlaygroundPath(pathname) {
  return pathname.startsWith(PLAYGROUND_PATH_PREFIX);
}

export const DRAFT_STORAGE_KEY = 'bug-rewind-create-draft';
export const PENDING_REPLAY_KEY = 'bug-rewind-pending-replay';

export const DEFAULT_REPLAY_DELAY_MS = 300;
export const MIN_REPLAY_DELAY_MS = 50;
export const MAX_REPLAY_DELAY_MS = 500;

export function clampReplayDelay(ms) {
  const n = Number(ms);
  if (Number.isNaN(n)) return DEFAULT_REPLAY_DELAY_MS;
  return Math.min(MAX_REPLAY_DELAY_MS, Math.max(MIN_REPLAY_DELAY_MS, Math.round(n)));
}

export function savePlaygroundReturn(path) {
  if (path && !isPlaygroundPath(path)) {
    sessionStorage.setItem(PLAYGROUND_RETURN_KEY, path);
  }
}

export function getPlaygroundReturn(fallback = '/') {
  try {
    return sessionStorage.getItem(PLAYGROUND_RETURN_KEY) || fallback;
  } catch {
    return fallback;
  }
}
