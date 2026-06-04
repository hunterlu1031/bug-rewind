import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  clampReplayDelay,
  DEFAULT_REPLAY_DELAY_MS,
} from '../../constants/playground';
import { useReplayContext } from '../../context/ReplayContext';
import { getReplayStartPath } from '../../utils/replayLaunch';
import { labelForStep } from '../../utils/selectors';
import { ReplaySpeedControl } from './ReplaySpeedControl';

export function PlaygroundReplayStatus() {
  const navigate = useNavigate();
  const {
    replayPhase,
    replayMeta,
    lastReplayPayload,
    dismissReplay,
    replayAgain,
    isReplaying,
  } = useReplayContext();

  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_REPLAY_DELAY_MS);

  useEffect(() => {
    if (lastReplayPayload?.stepDelayMs) {
      setStepDelayMs(lastReplayPayload.stepDelayMs);
    } else if (replayMeta?.stepDelayMs) {
      setStepDelayMs(replayMeta.stepDelayMs);
    }
  }, [lastReplayPayload?.stepDelayMs, replayMeta?.stepDelayMs]);

  if (replayPhase === 'idle' || !replayMeta) return null;

  const total = replayMeta.totalSteps || 1;
  const current = replayMeta.currentStep != null ? replayMeta.currentStep + 1 : 0;
  const progress = replayPhase === 'complete'
    ? 100
    : Math.round((current / total) * 100);

  const currentStep = replayMeta.currentStepData;
  const canReplayAgain = !isReplaying && lastReplayPayload?.steps?.length > 0;

  const handleReplayAgain = () => {
    const delay = clampReplayDelay(stepDelayMs);
    const startPath = getReplayStartPath(lastReplayPayload.steps);
    replayAgain(delay);
    navigate(startPath);
  };

  return (
    <div
      data-testid="playground-replay-status"
      className={`pg-card border-2 px-5 py-5 ${
        replayPhase === 'complete'
          ? 'border-emerald-200 bg-emerald-50/80'
          : replayPhase === 'error'
            ? 'border-red-200 bg-red-50/80'
            : 'border-pg-glow bg-pg-accent-soft/50'
      }`}
    >
      <div className="flex flex-col gap-5">
        <div className="min-w-0 flex-1">
          {replayPhase === 'running' && (
            <>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-pg-accent" />
                </span>
                <h3 className="text-lg font-bold text-pg-ink">Replay in progress</h3>
              </div>
              <p className="mt-1 text-sm text-pg-muted">
                Bug #{replayMeta.bugId} · Step {current} of {total}
              </p>
              {currentStep && (
                <p className="mt-2 truncate text-sm font-medium text-pg-ink">
                  {currentStep.label || labelForStep(currentStep)}
                </p>
              )}
            </>
          )}

          {replayPhase === 'complete' && (
            <>
              <h3 className="text-lg font-bold text-emerald-900" data-testid="replay-finished-title">
                Replay finished
              </h3>
              <p className="mt-1 text-sm text-emerald-800">
                All {total} steps completed for Bug #{replayMeta.bugId}.
              </p>
            </>
          )}

          {replayPhase === 'error' && (
            <>
              <h3 className="text-lg font-bold text-red-900">Replay paused</h3>
              <p className="mt-1 text-sm text-red-800">
                {replayMeta.errorMessage || 'A step could not be executed.'}
              </p>
            </>
          )}

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-medium text-pg-muted">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner"
              data-testid="replay-progress-bar-track"
            >
              <div
                data-testid="replay-progress-bar-fill"
                className={`h-full rounded-full transition-all duration-300 ${
                  replayPhase === 'complete'
                    ? 'bg-emerald-500'
                    : replayPhase === 'error'
                      ? 'bg-red-500'
                      : 'bg-pg-accent'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <ReplaySpeedControl
          value={stepDelayMs}
          onChange={setStepDelayMs}
          disabled={isReplaying}
          tone="playground"
        />

        <div className="flex flex-wrap gap-2">
          {canReplayAgain && (
            <button
              type="button"
              data-testid="replay-again-button"
              onClick={handleReplayAgain}
              className="rounded-xl bg-pg-accent px-4 py-2 text-sm font-medium text-white hover:bg-pg-accent-hover"
            >
              Replay again
            </button>
          )}
          {(replayPhase === 'complete' || replayPhase === 'error') && replayMeta.returnPath && (
            <Link to={replayMeta.returnPath} data-testid="replay-return-button">
              <button
                type="button"
                onClick={dismissReplay}
                className="rounded-xl border border-pg-line bg-pg-surface px-4 py-2 text-sm font-medium text-pg-ink hover:bg-pg-bg"
              >
                Return to previous screen
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
