import { clampReplayDelay, PLAYGROUND_ROOT_ID } from '../constants/playground';

const HIGHLIGHT_CLASS = 'replay-highlight';

export function clearReplayHighlight(root = document) {
  root.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });
}

function getPlaygroundRoot() {
  return document.getElementById(PLAYGROUND_ROOT_ID);
}

function highlightElement(element, rootEl) {
  clearReplayHighlight(rootEl || document);
  if (!element) return;
  element.classList.add(HIGHLIGHT_CLASS);
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

async function executeStep(step, onNavigation, rootEl) {
  if (step.type === 'navigation') {
    if (step.path && onNavigation) {
      await onNavigation(step.path);
    }
    return { ok: true };
  }

  const element = await waitForElement(step, rootEl);
  if (!element) {
    return { ok: false, error: `Element not found: ${step.selector || step.testId}` };
  }

  highlightElement(element, rootEl);
  await wait(120);

  if (step.type === 'click') {
    element.click();
    await wait(80);
    return { ok: true };
  }

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

export async function runReplay(steps, options = {}) {
  const {
    stepDelayMs = 300,
    onProgress,
    onError,
    onNavigation,
    shouldCancel,
  } = options;

  const delay = clampReplayDelay(stepDelayMs);

  for (let i = 0; i < steps.length; i++) {
    if (shouldCancel?.()) {
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

    const result = await executeStep(step, onNavigation, rootEl);
    if (!result.ok) {
      clearReplayHighlight(rootEl || document);
      onError?.({ index: i, step, message: result.error });
      return { failed: true, failedIndex: i, message: result.error };
    }

    await wait(delay);
  }

  const rootEl = getPlaygroundRoot() || document;
  clearReplayHighlight(rootEl);
  return { success: true, completedSteps: steps.length };
}
