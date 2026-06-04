import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clampReplayDelay, PLAYGROUND_ROOT_ID } from '../constants/playground';
import { useReplayContext } from '../context/ReplayContext';
import { runReplay } from '../utils/replayEngine';
import { labelForStep } from '../utils/selectors';

function waitForPlaygroundRoot(maxMs = 6000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const el = document.getElementById(PLAYGROUND_ROOT_ID);
      if (el) {
        resolve(el);
        return;
      }
      if (Date.now() - start >= maxMs) {
        resolve(null);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export function PlaygroundReplayRunner() {
  const navigate = useNavigate();
  const {
    pendingReplay,
    consumePendingReplay,
    startReplaySession,
    completeReplaySession,
    failReplaySession,
    updateReplayMeta,
  } = useReplayContext();

  const pendingId = pendingReplay?.id;

  useEffect(() => {
    if (!pendingId) return undefined;

    consumePendingReplay(async (payload) => {
      const { bugId, steps, stepDelayMs, returnPath } = payload;
      const delay = clampReplayDelay(stepDelayMs);

      await waitForPlaygroundRoot();
      await new Promise((r) => setTimeout(r, 200));

      startReplaySession({
        bugId,
        totalSteps: steps.length,
        currentStep: 0,
        returnPath,
        stepDelayMs: delay,
      });

      const navigateTo = async (path) => {
        navigate(path);
        await new Promise((r) => setTimeout(r, 350));
        await waitForPlaygroundRoot();
      };

      let reportedError = false;

      const result = await runReplay(steps, {
        stepDelayMs: delay,
        onNavigation: navigateTo,
        onProgress: ({ index, step }) => {
          updateReplayMeta({
            currentStep: index,
            currentStepData: step,
            stepDelayMs: delay,
          });
        },
        onError: ({ index, step, message }) => {
          reportedError = true;
          failReplaySession({
            bugId,
            totalSteps: steps.length,
            currentStep: index,
            returnPath,
            stepDelayMs: delay,
            currentStepData: step,
            errorMessage: message,
          });
        },
      });

      if (result.success) {
        completeReplaySession({
          bugId,
          totalSteps: steps.length,
          currentStep: steps.length - 1,
          returnPath,
          stepDelayMs: delay,
        });
      } else if (result.cancelled && !reportedError) {
        failReplaySession({
          bugId,
          returnPath,
          stepDelayMs: delay,
          errorMessage: 'Replay was cancelled.',
        });
      }

      return result;
    });

    return undefined;
  }, [
    pendingId,
    consumePendingReplay,
    navigate,
    startReplaySession,
    completeReplaySession,
    failReplaySession,
    updateReplayMeta,
  ]);

  return null;
}
