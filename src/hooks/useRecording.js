import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isPlaygroundPath } from '../constants/playground';
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
  const isRecordingRef = useRef(false);
  const lastPathRef = useRef(null);
  const playgroundRootRef = useRef(null);
  const location = useLocation();

  const setPlaygroundRoot = useCallback((el) => {
    playgroundRootRef.current = el;
  }, []);

  const pushStep = useCallback((step) => {
    setTemporarySteps((prev) => [...prev, buildStep(step)]);
  }, []);

  const startRecording = useCallback(() => {
    setTemporarySteps([]);
    setFinalizedSteps([]);
    isRecordingRef.current = true;
    setIsRecording(true);
    lastPathRef.current = location.pathname;
    pushStep({
      type: 'navigation',
      path: location.pathname,
      label: `Start at ${location.pathname}`,
    });
  }, [location.pathname, pushStep]);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setTemporarySteps((current) => {
      setFinalizedSteps([...current]);
      return current;
    });
  }, []);

  const clearRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setTemporarySteps([]);
    setFinalizedSteps([]);
  }, []);

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
    pushStep({
      type: 'navigation',
      path: location.pathname,
      label: `Navigate to ${location.pathname}`,
    });
  }, [location.pathname, pushStep]);

  useEffect(() => {
    if (!isRecording) return undefined;
    const root = playgroundRootRef.current;

    const handleClick = (event) => {
      if (!isRecordingRef.current) return;
      if (!isInsidePlayground(event.target, root)) return;
      const testId = getTestIdFromElement(event.target);
      if (!testId) return;
      if (testId.startsWith('recording-') || testId.startsWith('playground-chrome-')) return;

      pushStep({
        type: 'click',
        testId,
        selector: selectorFromTestId(testId),
        label: `Click ${testId}`,
      });
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
    document.addEventListener('change', handleInput, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('change', handleInput, true);
    };
  }, [isRecording, pushStep]);

  return {
    isRecording,
    temporarySteps,
    finalizedSteps,
    recordingAllowed,
    setRecordingAllowed,
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
