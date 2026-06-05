import { MAX_REPLAY_STEPS } from '../constants/replay';
import { selectorFromTestId } from './selectors';

/**
 * @typedef {'click' | 'input' | 'navigation'} ReplayStepType
 * @typedef {{ type: ReplayStepType, selector: string, value?: string, timestamp: number, testId?: string, path?: string, label?: string }} NormalizedReplayStep
 */

export function resolveStepSelector(step) {
  if (step?.selector) return String(step.selector);
  if (step?.testId) return selectorFromTestId(step.testId);
  if (step?.type === 'navigation' && step?.path) {
    return `navigation:${step.path}`;
  }
  return '';
}

/** @returns {NormalizedReplayStep | null} */
export function normalizeReplayStep(step) {
  if (!step || typeof step !== 'object') return null;

  const type = step.type;
  if (type !== 'click' && type !== 'input' && type !== 'navigation') return null;

  const selector = resolveStepSelector(step);
  if (!selector) return null;

  const timestamp =
    typeof step.timestamp === 'number' && Number.isFinite(step.timestamp)
      ? step.timestamp
      : Date.now();

  const normalized = {
    type,
    selector,
    timestamp,
  };

  if (type === 'input' && step.value != null) {
    normalized.value = String(step.value);
  }

  if (step.testId) normalized.testId = String(step.testId);
  if (step.path) normalized.path = String(step.path);
  if (step.label) normalized.label = String(step.label);
  if (typeof step.screenshot === 'string' && step.screenshot.startsWith('data:image/')) {
    normalized.screenshot = step.screenshot;
  }

  return normalized;
}

/** @param {unknown[]} steps */
export function normalizeReplaySteps(steps) {
  if (!Array.isArray(steps)) return [];

  const normalized = [];
  for (const step of steps) {
    const item = normalizeReplayStep(step);
    if (item) normalized.push(item);
    if (normalized.length >= MAX_REPLAY_STEPS) break;
  }

  return normalized;
}

export function createPendingStepResults(stepCount) {
  return Array.from({ length: stepCount }, () => ({ status: 'pending' }));
}

export function stepTypeLabel(type) {
  switch (type) {
    case 'click':
      return 'Click';
    case 'input':
      return 'Input';
    case 'navigation':
      return 'Navigation';
    default:
      return 'Step';
  }
}
