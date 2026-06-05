import {
  clampReplayDelay,
  DEFAULT_REPLAY_DELAY_MS,
  PLAYGROUND_ROOT_ID,
} from '../constants/playground';
import { removeReplayClickCursor, showReplayClickAnimation } from './replayClickEffect';

const HIGHLIGHT_CLASS = 'replay-highlight';
const HIGHLIGHT_CLICK_CLASS = 'replay-highlight-click';

export function clearReplayHighlight(root = document) {
  root.querySelectorAll(`.${HIGHLIGHT_CLASS}, .${HIGHLIGHT_CLICK_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS, HIGHLIGHT_CLICK_CLASS);
  });
  removeReplayClickCursor(root);
}

function getPlaygroundRoot() {
  return document.getElementById(PLAYGROUND_ROOT_ID);
}

function highlightElement(element, rootEl, stepType) {
  clearReplayHighlight(rootEl || document);
  if (!element) return;
  element.classList.add(stepType === 'click' ? HIGHLIGHT_CLICK_CLASS : HIGHLIGHT_CLASS);
  element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findElement(step, rootEl) {
  if (!rootEl) return null;
  if (step.selector) {
    return rootEl.querySelector(step.selector);
  }
  if (step.testId) {
    return rootEl.querySelector(`[data-testid="${step.testId}"]`);
  }
  return null;
}

async function waitForElement(step, rootEl, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const el = findElement(step, rootEl);
    if (el) return el;
    await wait(50);
  }
  return null;
}

function setNativeInputValue(element, value) {
  const tag = element.tagName.toLowerCase();
  const proto =
    tag === 'textarea'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

async function executeStep(step, onNavigation, rootEl, nextStep) {
  if (step.type === 'navigation') {
    if (step.path && onNavigation) {
      await onNavigation(step.path);
    }
    if (nextStep && nextStep.type !== 'navigation') {
      const root = getPlaygroundRoot() || rootEl;
      await waitForElement(nextStep, root, 8000);
    }
    return { ok: true };
  }

  const element = await waitForElement(step, rootEl);
  if (!element) {
    return { ok: false, error: `Element not found: ${step.selector || step.testId}` };
  }

  highlightElement(element, rootEl, step.type);

  if (step.type === 'click') {
    await wait(80);
    await showReplayClickAnimation(element, rootEl);
    element.click();
    await wait(80);
    return { ok: true };
  }

  await wait(120);

  if (step.type === 'input') {
    const tag = element.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      element.focus();
      setNativeInputValue(element, step.value ?? '');
      await wait(80);
      return { ok: true };
    }
    return { ok: false, error: 'Target is not an input element' };
  }

  return { ok: false, error: `Unknown step type: ${step.type}` };
}

async function waitWhilePaused(shouldPause, shouldCancel) {
  while (shouldPause?.()) {
    if (shouldCancel?.()) return true;
    await wait(80);
  }
  return shouldCancel?.() ?? false;
}

export async function runReplay(steps, options = {}) {
  const {
    stepDelayMs = DEFAULT_REPLAY_DELAY_MS,
    onProgress,
    onError,
    onNavigation,
    onStepComplete,
    shouldCancel,
    shouldPause,
  } = options;

  const delay = clampReplayDelay(stepDelayMs);

  for (let i = 0; i < steps.length; i++) {
    if (shouldCancel?.()) {
      const rootEl = getPlaygroundRoot() || document;
      clearReplayHighlight(rootEl);
      return { cancelled: true, completedSteps: i };
    }

    const cancelledWhilePaused = await waitWhilePaused(shouldPause, shouldCancel);
    if (cancelledWhilePaused) {
      const rootEl = getPlaygroundRoot() || document;
      clearReplayHighlight(rootEl);
      return { cancelled: true, completedSteps: i };
    }

    const step = steps[i];
    const rootEl = getPlaygroundRoot();
    if (!rootEl && step.type !== 'navigation') {
      onError?.({ index: i, step, message: 'Test Playground root not found' });
      return { failed: true, failedIndex: i, message: 'Test Playground root not found' };
    }

    onProgress?.({ index: i, step, total: steps.length });

    const result = await executeStep(step, onNavigation, rootEl, steps[i + 1]);
    onStepComplete?.({ index: i, step, ok: result.ok, error: result.error });

    if (!result.ok) {
      clearReplayHighlight(rootEl || document);
      onError?.({ index: i, step, message: result.error });
      return { failed: true, failedIndex: i, message: result.error };
    }

    const cancelledAfterStep = await waitWhilePaused(shouldPause, shouldCancel);
    if (cancelledAfterStep) {
      const rootElAfter = getPlaygroundRoot() || document;
      clearReplayHighlight(rootElAfter);
      return { cancelled: true, completedSteps: i + 1 };
    }

    await wait(delay);
  }

  const rootEl = getPlaygroundRoot() || document;
  clearReplayHighlight(rootEl);
  return { success: true, completedSteps: steps.length };
}
