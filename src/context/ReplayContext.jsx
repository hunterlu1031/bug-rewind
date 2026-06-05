import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { clampReplayDelay } from '../constants/playground';
import { createPendingStepResults } from '../utils/replaySteps';

const ReplayContext = createContext(null);

let replayIdCounter = 0;

export function ReplayProvider({ children }) {
  const [replayPhase, setReplayPhase] = useState('idle');
  const [replayMeta, setReplayMeta] = useState(null);
  const [pendingReplay, setPendingReplay] = useState(null);
  const [lastReplayPayload, setLastReplayPayload] = useState(null);
  const [lastStepResults, setLastStepResults] = useState(null);
  const [inspectorSelectedIndex, setInspectorSelectedIndex] = useState(0);
  const [replayPaused, setReplayPaused] = useState(false);

  const pendingRef = useRef(null);
  const replayRunRef = useRef(false);
  const replayPausedRef = useRef(false);
  const cancelReplayRef = useRef(false);

  const syncPauseRef = useCallback((paused) => {
    replayPausedRef.current = paused;
    setReplayPaused(paused);
  }, []);

  const queueReplay = useCallback((payload) => {
    replayIdCounter += 1;
    cancelReplayRef.current = false;
    syncPauseRef(false);
    const item = {
      ...payload,
      stepDelayMs: clampReplayDelay(payload.stepDelayMs),
      id: replayIdCounter,
    };
    pendingRef.current = item;
    setPendingReplay(item);
    setLastReplayPayload({
      bugId: item.bugId,
      steps: item.steps,
      returnPath: item.returnPath,
      stepDelayMs: item.stepDelayMs,
      startPath: item.startPath,
    });
    setInspectorSelectedIndex(0);
  }, [syncPauseRef]);

  const replayAgain = useCallback((stepDelayMs) => {
    if (!lastReplayPayload) return;
    queueReplay({
      ...lastReplayPayload,
      stepDelayMs: clampReplayDelay(stepDelayMs ?? lastReplayPayload.stepDelayMs),
    });
  }, [lastReplayPayload, queueReplay]);

  const startReplaySession = useCallback((meta) => {
    const stepResults = createPendingStepResults(meta.totalSteps || 0);
    setReplayMeta({ ...meta, stepResults });
    setReplayPhase('running');
    setInspectorSelectedIndex(0);
    syncPauseRef(false);
    cancelReplayRef.current = false;
  }, [syncPauseRef]);

  const completeReplaySession = useCallback((partial = {}) => {
    setReplayMeta((prev) => {
      const next = { ...prev, ...partial, currentStep: partial.currentStep ?? prev?.currentStep };
      if (next?.stepResults && next.bugId != null) {
        setLastStepResults({ bugId: next.bugId, results: next.stepResults });
      }
      return next;
    });
    setReplayPhase('complete');
    syncPauseRef(false);
  }, [syncPauseRef]);

  const failReplaySession = useCallback((partial = {}) => {
    setReplayMeta((prev) => {
      const next = { ...prev, ...partial };
      if (next?.stepResults && next.bugId != null) {
        setLastStepResults({ bugId: next.bugId, results: next.stepResults });
      }
      return next;
    });
    setReplayPhase('error');
    syncPauseRef(false);
  }, [syncPauseRef]);

  const dismissReplay = useCallback(() => {
    setReplayPhase('idle');
    setReplayMeta(null);
    syncPauseRef(false);
    cancelReplayRef.current = false;
  }, [syncPauseRef]);

  const updateReplayMeta = useCallback((partial) => {
    setReplayMeta((prev) => (prev ? { ...prev, ...partial } : partial));
  }, []);

  const updateStepResult = useCallback((index, result) => {
    setReplayMeta((prev) => {
      if (!prev?.stepResults) return prev;
      const stepResults = [...prev.stepResults];
      stepResults[index] = { ...stepResults[index], ...result };
      return { ...prev, stepResults };
    });
  }, []);

  const pauseReplay = useCallback(() => {
    syncPauseRef(true);
  }, [syncPauseRef]);

  const resumeReplay = useCallback(() => {
    syncPauseRef(false);
  }, [syncPauseRef]);

  const requestCancelReplay = useCallback(() => {
    cancelReplayRef.current = true;
    syncPauseRef(false);
  }, [syncPauseRef]);

  const selectInspectorStep = useCallback((index, { pauseIfRunning = false } = {}) => {
    setInspectorSelectedIndex(index);
    if (pauseIfRunning && replayPhase === 'running') {
      syncPauseRef(true);
    }
  }, [replayPhase, syncPauseRef]);

  const consumePendingReplay = useCallback(async (runner) => {
    if (replayRunRef.current || !pendingRef.current) return null;

    replayRunRef.current = true;
    const payload = pendingRef.current;
    pendingRef.current = null;
    setPendingReplay(null);

    try {
      return await runner(payload);
    } finally {
      replayRunRef.current = false;
    }
  }, []);

  const activeStepIndex =
    replayMeta?.currentStep != null ? replayMeta.currentStep : null;

  return (
    <ReplayContext.Provider
      value={{
        replayPhase,
        isReplaying: replayPhase === 'running',
        replayComplete: replayPhase === 'complete',
        replayFailed: replayPhase === 'error',
        replayMeta,
        lastReplayPayload,
        lastStepResults,
        pendingReplay,
        queueReplay,
        replayAgain,
        startReplaySession,
        completeReplaySession,
        failReplaySession,
        dismissReplay,
        updateReplayMeta,
        updateStepResult,
        consumePendingReplay,
        inspectorSelectedIndex,
        setInspectorSelectedIndex,
        selectInspectorStep,
        activeStepIndex,
        replayPaused,
        pauseReplay,
        resumeReplay,
        requestCancelReplay,
        replayPausedRef,
        cancelReplayRef,
      }}
    >
      {children}
    </ReplayContext.Provider>
  );
}

export function useReplayContext() {
  const ctx = useContext(ReplayContext);
  if (!ctx) throw new Error('useReplayContext must be used within ReplayProvider');
  return ctx;
}
