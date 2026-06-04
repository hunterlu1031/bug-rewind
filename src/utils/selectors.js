export function getTestIdFromElement(element) {
  if (!element || !(element instanceof Element)) return null;
  const withId = element.closest('[data-testid]');
  return withId?.getAttribute('data-testid') ?? null;
}

export function selectorFromTestId(testId) {
  return `[data-testid="${testId}"]`;
}

export function labelForStep(step) {
  switch (step.type) {
    case 'click':
      return `Click "${step.testId || step.selector}"`;
    case 'input':
      return `Enter value: "${step.value ?? ''}"`;
    case 'navigation':
      return `Navigate to ${step.path || 'page'}`;
    default:
      return step.type;
  }
}
