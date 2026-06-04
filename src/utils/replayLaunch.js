import { isPlaygroundPath } from '../constants/playground';

export function getReplayStartPath(steps) {
  const firstNav = steps.find((s) => s.type === 'navigation');
  if (firstNav?.path && isPlaygroundPath(firstNav.path)) {
    return firstNav.path;
  }
  return '/playground/login';
}
