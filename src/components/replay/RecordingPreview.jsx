import { useState } from 'react';
import { labelForStep } from '../../utils/selectors';
import { Button } from '../ui/Button';
import { StepScreenshotThumb } from './StepScreenshotThumb';

function stepTypeLabel(type) {
  switch (type) {
    case 'click':
      return 'Click';
    case 'input':
      return 'Input';
    case 'navigation':
      return 'Navigate';
    default:
      return type || 'Step';
  }
}

const STEP_TYPE_CLASSES = {
  stripe: {
    click: 'bg-stripe-accent-soft text-stripe-accent',
    input: 'bg-amber-50 text-amber-800',
    navigation: 'bg-sky-50 text-sky-700',
    default: 'bg-stripe-bg text-stripe-muted',
  },
  playground: {
    click: 'bg-pg-accent-soft text-pg-accent',
    input: 'bg-amber-100 text-amber-900',
    navigation: 'bg-sky-100 text-sky-800',
    default: 'bg-pg-bg text-pg-muted',
  },
};

function stepTypeClass(type, tone = 'stripe') {
  const map = STEP_TYPE_CLASSES[tone] || STEP_TYPE_CLASSES.stripe;
  return map[type] || map.default;
}

const PREVIEW_THEMES = {
  stripe: {
    empty: 'text-stripe-muted',
    count: 'text-stripe-ink',
    toggle: 'text-stripe-accent',
    list: 'border-stripe-border bg-stripe-bg',
    item: 'border-stripe-border/80 bg-stripe-surface shadow-sm',
    index: 'text-stripe-faint',
    label: 'text-stripe-ink',
    detail: 'text-stripe-muted',
    time: 'text-stripe-faint',
  },
  playground: {
    empty: 'text-pg-muted',
    count: 'text-pg-ink',
    toggle: 'text-pg-accent',
    list: 'border-pg-line bg-pg-bg/80',
    item: 'border-pg-line bg-pg-surface',
    index: 'text-pg-muted',
    label: 'text-pg-ink',
    detail: 'text-pg-muted',
    time: 'text-pg-muted',
  },
};
function stepDetail(step) {
  if (step.type === 'input') {
    return step.value != null && step.value !== '' ? `Value: "${step.value}"` : 'Empty value';
  }
  if (step.type === 'navigation' && step.path) {
    return step.path;
  }
  if (step.testId) {
    return step.testId;
  }
  if (step.selector) {
    return step.selector;
  }
  return null;
}

export function RecordingPreview({
  steps = [],
  defaultExpanded = true,
  tone = 'stripe',
  showReplayCta = false,
  onReplay,
  replayDisabled = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = PREVIEW_THEMES[tone] || PREVIEW_THEMES.stripe;

  if (!steps.length) {
    return (
      <p className={`text-sm ${theme.empty}`} data-testid="recording-preview-empty">
        No recording attached.
      </p>
    );
  }

  return (
    <div data-testid="recording-preview" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`text-sm font-medium ${theme.count}`}>
          {steps.length} recorded step{steps.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          data-testid="recording-preview-toggle"
          onClick={() => setExpanded((e) => !e)}
          className={`text-sm font-medium hover:underline ${theme.toggle}`}
        >
          {expanded ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      {expanded && (
        <ol
          className={`max-h-80 space-y-2 overflow-y-auto rounded-lg border p-3 ${theme.list}`}
          data-testid="recording-preview-list"
        >
          {steps.map((step, i) => {
            const detail = stepDetail(step);
            return (
              <li
                key={`${step.timestamp}-${i}`}
                className={`rounded-md border px-3 py-2.5 ${theme.item}`}
                data-testid={`recording-preview-step-${i}`}
              >
                <div className="flex flex-wrap items-start gap-2">
                  <span className={`font-mono text-xs font-medium ${theme.index}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${stepTypeClass(step.type, tone)}`}
                  >
                    {stepTypeLabel(step.type)}
                  </span>
                  <span className={`min-w-0 flex-1 text-sm font-medium ${theme.label}`}>
                    {step.label || labelForStep(step)}
                  </span>
                </div>
                {detail && (
                  <p className={`mt-1 truncate pl-7 font-mono text-xs ${theme.detail}`}>{detail}</p>
                )}
                {step.timestamp && (
                  <p className={`mt-0.5 pl-7 text-[10px] ${theme.time}`}>
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </p>
                )}
                {step.screenshot && (
                  <div className="pl-7">
                    <StepScreenshotThumb
                      screenshot={step.screenshot}
                      alt={`Screenshot for step ${i + 1}`}
                      className={tone === 'playground' ? 'border-pg-line' : ''}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {showReplayCta && onReplay && (
        <Button
          data-testid="recording-preview-replay"
          onClick={onReplay}
          disabled={replayDisabled}
          className="w-full sm:w-auto"
        >
          Run replay in Test Playground
        </Button>
      )}
    </div>
  );
}
