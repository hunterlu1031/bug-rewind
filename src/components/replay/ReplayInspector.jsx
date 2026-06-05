import { memo, useMemo } from 'react';
import { MAX_REPLAY_STEPS } from '../../constants/replay';
import { stepTypeLabel } from '../../utils/replaySteps';
import { labelForStep } from '../../utils/selectors';
import { Button } from '../ui/Button';
import { StepScreenshotThumb } from './StepScreenshotThumb';

const THEMES = {
  stripe: {
    empty: 'text-stripe-muted',
    warn: 'text-amber-700',
    list: 'border-stripe-border bg-stripe-bg',
    item: 'border-stripe-border bg-stripe-surface',
    itemActive: 'border-stripe-accent bg-stripe-accent-soft ring-1 ring-stripe-accent/40',
    itemSelected: 'border-stripe-accent/60 bg-stripe-surface',
    index: 'text-stripe-faint',
    typeClick: 'bg-stripe-accent-soft text-stripe-accent',
    typeInput: 'bg-amber-50 text-amber-800',
    typeNav: 'bg-sky-50 text-sky-700',
    typeDefault: 'bg-stripe-bg text-stripe-muted',
    panel: 'border-stripe-border bg-stripe-bg',
    label: 'text-stripe-ink',
    muted: 'text-stripe-muted',
    success: 'text-emerald-600',
    failed: 'text-red-600',
    pending: 'text-stripe-muted',
  },
  playground: {
    empty: 'text-pg-muted',
    warn: 'text-amber-800',
    list: 'border-pg-line bg-pg-bg/80',
    item: 'border-pg-line bg-pg-surface',
    itemActive: 'border-pg-accent bg-pg-accent-soft ring-2 ring-pg-accent/30',
    itemSelected: 'border-pg-line bg-pg-surface ring-1 ring-pg-accent/50',
    index: 'text-pg-muted',
    typeClick: 'bg-pg-accent-soft text-pg-accent',
    typeInput: 'bg-amber-100 text-amber-900',
    typeNav: 'bg-sky-100 text-sky-800',
    typeDefault: 'bg-pg-bg text-pg-muted',
    panel: 'border-pg-line bg-pg-bg/60',
    label: 'text-pg-ink',
    muted: 'text-pg-muted',
    success: 'text-emerald-700',
    failed: 'text-red-700',
    pending: 'text-pg-muted',
  },
};

function typeBadgeClass(type, theme) {
  if (type === 'click') return theme.typeClick;
  if (type === 'input') return theme.typeInput;
  if (type === 'navigation') return theme.typeNav;
  return theme.typeDefault;
}

function statusLabel(status) {
  switch (status) {
    case 'success':
      return 'Success';
    case 'failed':
      return 'Failed';
    case 'skipped':
      return 'Skipped';
    default:
      return 'Pending';
  }
}

function statusClass(status, theme) {
  if (status === 'success') return theme.success;
  if (status === 'failed') return theme.failed;
  return theme.pending;
}

const ReplayStepRow = memo(function ReplayStepRow({
  step,
  index,
  isActive,
  isSelected,
  executionStatus,
  theme,
  onSelect,
  compact = false,
}) {
  return (
    <li>
      <button
        type="button"
        data-testid={`replay-inspector-step-${index}`}
        onClick={() => onSelect(index)}
        className={`w-full rounded-md border text-left transition-colors ${
          compact ? 'px-2 py-1' : 'px-3 py-2.5'
        } ${
          isActive
            ? theme.itemActive
            : isSelected
              ? theme.itemSelected
              : theme.item
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className={`font-mono text-xs font-medium ${theme.index}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeBadgeClass(step.type, theme)}`}
          >
            {stepTypeLabel(step.type)}
          </span>
          <span
            className={`min-w-0 flex-1 truncate font-medium ${theme.label} ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {step.label || labelForStep(step)}
          </span>
          <span
            className={`text-[10px] font-semibold uppercase ${statusClass(executionStatus, theme)}`}
            data-testid={`replay-inspector-step-status-${index}`}
          >
            {statusLabel(executionStatus)}
          </span>
        </div>
      </button>
    </li>
  );
});

function StepInspectionPanel({ step, executionResult, theme }) {
  const status = executionResult?.status || 'pending';

  return (
    <div
      className={`rounded-lg border p-4 ${theme.panel}`}
      data-testid="replay-inspector-detail"
    >
      <h4 className={`text-sm font-semibold ${theme.label}`}>Step inspection</h4>
      <dl className="mt-3 space-y-2.5 text-sm">
        <div>
          <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
            Action type
          </dt>
          <dd className={theme.label} data-testid="inspector-detail-type">
            {stepTypeLabel(step.type)}
          </dd>
        </div>
        <div>
          <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
            Selector
          </dt>
          <dd className={`break-all font-mono text-xs ${theme.label}`} data-testid="inspector-detail-selector">
            {step.selector}
          </dd>
        </div>
        {step.type === 'input' && (
          <div>
            <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
              Value
            </dt>
            <dd className={`break-all font-mono text-xs ${theme.label}`} data-testid="inspector-detail-value">
              {step.value ?? '(empty)'}
            </dd>
          </div>
        )}
        {step.type === 'navigation' && step.path && (
          <div>
            <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
              Path
            </dt>
            <dd className={`font-mono text-xs ${theme.label}`}>{step.path}</dd>
          </div>
        )}
        <div>
          <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
            Timestamp
          </dt>
          <dd className={theme.label} data-testid="inspector-detail-timestamp">
            {new Date(step.timestamp).toLocaleString()}
          </dd>
        </div>
        {step.screenshot && (
          <div>
            <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
              Screenshot
            </dt>
            <dd className="mt-1">
              <div data-testid="inspector-detail-screenshot">
                <StepScreenshotThumb screenshot={step.screenshot} alt="Step evidence" />
              </div>
            </dd>
          </div>
        )}
        <div>
          <dt className={`text-xs font-medium uppercase tracking-wide ${theme.muted}`}>
            Execution result
          </dt>
          <dd
            className={`font-medium ${statusClass(status, theme)}`}
            data-testid="inspector-detail-status"
          >
            {statusLabel(status)}
            {executionResult?.error && (
              <span className="mt-1 block text-xs font-normal text-red-600">
                {executionResult.error}
              </span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ReplayInspector({
  steps = [],
  activeStepIndex = null,
  selectedStepIndex = 0,
  onSelectStep,
  stepResults = [],
  tone = 'stripe',
  isReplayActive = false,
  isPaused = false,
  onResume,
  onCancelReplay,
  truncated = false,
  compact = false,
}) {
  const theme = THEMES[tone] || THEMES.stripe;

  const safeSelected = useMemo(() => {
    if (!steps.length) return 0;
    return Math.min(Math.max(0, selectedStepIndex ?? 0), steps.length - 1);
  }, [steps.length, selectedStepIndex]);

  const selectedStep = steps[safeSelected];
  const selectedResult = stepResults[safeSelected];
  const showDetailPanel = !compact && selectedStep;

  if (!steps.length) {
    return (
      <p className={`text-sm ${theme.empty}`} data-testid="replay-inspector-empty">
        No replay steps to inspect.
      </p>
    );
  }

  return (
    <div data-testid="replay-inspector" className={compact ? 'space-y-2' : 'space-y-4'}>
      {truncated && (
        <p className={`text-xs ${theme.warn}`} data-testid="replay-inspector-truncated">
          Showing first {MAX_REPLAY_STEPS} steps (max per replay).
        </p>
      )}

      {isReplayActive && isPaused && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span>Replay paused — inspect steps or resume.</span>
          {onResume && (
            <Button size="sm" data-testid="replay-inspector-resume" onClick={onResume}>
              Resume
            </Button>
          )}
          {onCancelReplay && (
            <Button
              size="sm"
              variant="secondary"
              data-testid="replay-inspector-cancel"
              onClick={onCancelReplay}
            >
              Cancel replay
            </Button>
          )}
        </div>
      )}

      <div
        className={
          compact
            ? 'grid grid-cols-1'
            : 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]'
        }
      >
        <ol
          className={`space-y-1 overflow-y-auto rounded-lg border p-2 ${
            compact ? 'max-h-28' : 'max-h-72 space-y-2 p-3 lg:max-h-96'
          } ${theme.list}`}
          data-testid="replay-inspector-list"
        >
          {steps.map((step, index) => (
            <ReplayStepRow
              key={`${step.timestamp}-${index}`}
              step={step}
              index={index}
              isActive={activeStepIndex === index}
              isSelected={safeSelected === index}
              executionStatus={stepResults[index]?.status || 'pending'}
              theme={theme}
              onSelect={onSelectStep}
              compact={compact}
            />
          ))}
        </ol>

        {showDetailPanel && (
          <StepInspectionPanel
            step={selectedStep}
            executionResult={selectedResult}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
