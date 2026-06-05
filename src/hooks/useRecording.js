import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isPlaygroundPath } from '../constants/playground';
import { screenshotManager } from '../utils/screenshotManager';
import { getTestIdFromElement, selectorFromTestId } from '../utils/selectors';

function buildStep(base) {
  return {
    ...base,
    timestamp: Date.now(),
  };
}

function isInsidePlayground(target, rootEl) {
  if (!rootEl || !(target instanceof Node)) return false;
  return rootEl.contains(target);
}

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [temporarySteps, setTemporarySteps] = useState([]);
  const [finalizedSteps, setFinalizedSteps] = useState([]);
  const [recordingAllowed, setRecordingAllowed] = useState(true);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const isRecordingRef = useRef(false);
  const lastPathRef = useRef(null);
  const playgroundRootRef = useRef(null);
  const location = useLocation();

  const syncScreenshotCount = useCallback(() => {
    setScreenshotCount(screenshotManager.getCount());
  }, []);

  const setPlaygroundRoot = useCallback((el) => {
    playgroundRootRef.current = el;
  }, []);

  const pushStep = useCallback((step) => {
    setTemporarySteps((prev) => [...prev, buildStep(step)]);
  }, []);

  const attachScreenshotToStep = useCallback((built, screenshot) => {
    if (!screenshot) return;
    setTemporarySteps((prev) => {
      let matched = false;
      return prev.map((s) => {
        if (
          !matched
          && s.timestamp === built.timestamp
          && s.type === built.type
          && String(s.testId ?? '') === String(built.testId ?? '')
          && String(s.path ?? '') === String(built.path ?? '')
        ) {
          matched = true;
          return { ...s, screenshot };
        }
        return s;
      });
    });
  }, []);

  const pushStepWithScreenshot = useCallback(
    async (step, captureKey, { capture = true } = {}) => {
      const built = buildStep(step);
      pushStep(built);

      if (!capture || !isRecordingRef.current) return;

      const screenshot = await screenshotManager.captureForEvent(captureKey);
      syncScreenshotCount();
      attachScreenshotToStep(built, screenshot);
    },
    [pushStep, syncScreenshotCount, attachScreenshotToStep],
  );

  const startRecording = useCallback(async () => {
    screenshotManager.reset();
    syncScreenshotCount();
    setTemporarySteps([]);
    setFinalizedSteps([]);
    isRecordingRef.current = true;
    setIsRecording(true);
    lastPathRef.current = location.pathname;

    await pushStepWithScreenshot(
      {
        type: 'navigation',
        path: location.pathname,
        selector: `navigation:${location.pathname}`,
        label: `Start at ${location.pathname}`,
      },
      `nav:${location.pathname}`,
    );
  }, [location.pathname, pushStepWithScreenshot, syncScreenshotCount]);

  const stopRecording = useCallback(async () => {
    isRecordingRef.current = false;

    const screenshot = await screenshotManager.captureForEvent('stop-recording');
    syncScreenshotCount();

    setTemporarySteps((current) => {
      const steps = [...current];
      if (screenshot && steps.length > 0) {
        const lastIndex = steps.length - 1;
        const last = steps[lastIndex];
        if (!last.screenshot) {
          steps[lastIndex] = { ...last, screenshot };
        }
      }
      setFinalizedSteps(steps);
      return steps;
    });

    setIsRecording(false);
  }, [syncScreenshotCount]);

  const clearRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setTemporarySteps([]);
    setFinalizedSteps([]);
    screenshotManager.reset();
    syncScreenshotCount();
  }, [syncScreenshotCount]);

  const resetRecording = useCallback(() => {
    clearRecording();
  }, [clearRecording]);

  const attachFinalizedToSteps = useCallback(() => {
    if (finalizedSteps.length) return finalizedSteps;
    return temporarySteps;
  }, [finalizedSteps, temporarySteps]);

  useEffect(() => {
    if (!isRecordingRef.current) return;
    if (!isPlaygroundPath(location.pathname)) return;
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;

    pushStepWithScreenshot(
      {
        type: 'navigation',
        path: location.pathname,
        selector: `navigation:${location.pathname}`,
        label: `Navigate to ${location.pathname}`,
      },
      `nav:${location.pathname}`,
    );
  }, [location.pathname, pushStepWithScreenshot]);

  useEffect(() => {
    if (!isRecording) return undefined;
    const root = playgroundRootRef.current;

    const handleClick = (event) => {
      if (!isRecordingRef.current) return;
      if (!isInsidePlayground(event.target, root)) return;
      const testId = getTestIdFromElement(event.target);
      if (!testId) return;
      if (testId.startsWith('recording-') || testId.startsWith('playground-chrome-')) return;

      pushStepWithScreenshot(
        {
          type: 'click',
          testId,
          selector: selectorFromTestId(testId),
          label: `Click ${testId}`,
        },
        `click:${testId}`,
      );
    };

    const handleSubmit = (event) => {
      if (!isRecordingRef.current) return;
      if (!root?.contains(event.target)) return;
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const submitter = event.submitter;
      if (submitter && getTestIdFromElement(submitter)) {
        return;
      }

      const testId = getTestIdFromElement(form) || 'form-submit';

      pushStepWithScreenshot(
        {
          type: 'click',
          testId,
          selector: selectorFromTestId(testId),
          label: `Submit ${testId}`,
        },
        `submit:${testId}`,
      );
    };

    const handleInput = (event) => {
      if (!isRecordingRef.current) return;
      if (!isInsidePlayground(event.target, root)) return;
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement
          || target instanceof HTMLTextAreaElement
          || target instanceof HTMLSelectElement)
      ) {
        return;
      }
      const testId = getTestIdFromElement(target);
      if (!testId) return;

      pushStep({
        type: 'input',
        testId,
        selector: selectorFromTestId(testId),
        value: target.value,
        label: `Input ${testId}`,
      });
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleSubmit, true);
    document.addEventListener('change', handleInput, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      document.removeEventListener('change', handleInput, true);
    };
  }, [isRecording, pushStep, pushStepWithScreenshot]);

  return {
    isRecording,
    temporarySteps,
    finalizedSteps,
    recordingAllowed,
    setRecordingAllowed,
    screenshotCount,
    stepCount: isRecording ? temporarySteps.length : finalizedSteps.length,
    displaySteps: isRecording ? temporarySteps : finalizedSteps,
    startRecording,
    stopRecording,
    clearRecording,
    resetRecording,
    attachFinalizedToSteps,
    setFinalizedSteps,
    setPlaygroundRoot,
  };
}
