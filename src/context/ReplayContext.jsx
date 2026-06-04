import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { clampReplayDelay } from '../constants/playground';

const ReplayContext = createContext(null);

let replayIdCounter = 0;

export function ReplayProvider({ children }) {
  const [replayPhase, setReplayPhase] = useState('idle');
  const [replayMeta, setReplayMeta] = useState(null);
  const [pendingReplay, setPendingReplay] = useState(null);
  const [lastReplayPayload, setLastReplayPayload] = useState(null);
  const pendingRef = useRef(null);
  const replayRunRef = useRef(false);

  const queueReplay = useCallback((payload) => {
    replayIdCounter += 1;
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
  }, []);

  const replayAgain = useCallback((stepDelayMs) => {
    if (!lastReplayPayload) return;
    queueReplay({
      ...lastReplayPayload,
      stepDelayMs: clampReplayDelay(stepDelayMs ?? lastReplayPayload.stepDelayMs),
    });
  }, [lastReplayPayload, queueReplay]);

  const startReplaySession = useCallback((meta) => {
    setReplayMeta(meta);
    setReplayPhase('running');
  }, []);

  const completeReplaySession = useCallback((partial = {}) => {
    setReplayMeta((prev) => ({ ...prev, ...partial, currentStep: partial.currentStep ?? prev?.currentStep }));
    setReplayPhase('complete');
  }, []);

  const failReplaySession = useCallback((partial = {}) => {
    setReplayMeta((prev) => ({ ...prev, ...partial }));
    setReplayPhase('error');
  }, []);

  const dismissReplay = useCallback(() => {
    setReplayPhase('idle');
    setReplayMeta(null);
  }, []);

  const updateReplayMeta = useCallback((partial) => {
    setReplayMeta((prev) => (prev ? { ...prev, ...partial } : partial));
  }, []);

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

  return (
    <ReplayContext.Provider
      value={{
        replayPhase,
        isReplaying: replayPhase === 'running',
        replayComplete: replayPhase === 'complete',
        replayFailed: replayPhase === 'error',
        replayMeta,
        lastReplayPayload,
        pendingReplay,
        queueReplay,
        replayAgain,
        startReplaySession,
        completeReplaySession,
        failReplaySession,
        dismissReplay,
        updateReplayMeta,
        consumePendingReplay,
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
