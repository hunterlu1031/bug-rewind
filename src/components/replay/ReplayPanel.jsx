import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clampReplayDelay,
  DEFAULT_REPLAY_DELAY_MS,
  savePlaygroundReturn,
} from '../../constants/playground';
import { MAX_REPLAY_STEPS } from '../../constants/replay';
import { useReplayContext } from '../../context/ReplayContext';
import { getReplayStartPath } from '../../utils/replayLaunch';
import {
  createPendingStepResults,
  normalizeReplaySteps,
} from '../../utils/replaySteps';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { ReplayInspector } from './ReplayInspector';
import { ReplaySpeedControl } from './ReplaySpeedControl';

export function ReplayPanel({ bug }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { queueReplay, lastStepResults } = useReplayContext();
  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_REPLAY_DELAY_MS);
  const [lastMessage, setLastMessage] = useState('');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const rawSteps = bug.replaySteps || [];
  const steps = useMemo(() => normalizeReplaySteps(rawSteps), [rawSteps]);
  const truncated = rawSteps.length > MAX_REPLAY_STEPS;
  const hasPlaygroundSteps = steps.some(
    (s) => s.testId?.startsWith('pg-') || s.selector?.includes('pg-'),
  );

  const stepResults = useMemo(() => {
    if (lastStepResults?.bugId === bug.id && lastStepResults.results?.length === steps.length) {
      return lastStepResults.results;
    }
    return createPendingStepResults(steps.length);
  }, [lastStepResults, bug.id, steps.length]);

  const handleReplay = useCallback(() => {
    if (!steps.length) return;

    const startPath = getReplayStartPath(steps);
    const returnPath = location.pathname;
    const delay = clampReplayDelay(stepDelayMs);

    savePlaygroundReturn(returnPath);
    queueReplay({
      bugId: bug.id,
      steps,
      stepDelayMs: delay,
      returnPath,
      startPath,
    });

    setLastMessage('Opening Test Playground for replay…');
    navigate(startPath, { state: { returnTo: returnPath } });
  }, [bug.id, location.pathname, navigate, queueReplay, stepDelayMs, steps]);

  return (
    <Card data-testid="replay-panel">
      <CardHeader
        title="Replay"
        subtitle="Inspect steps below, then run them in the Test Playground."
      />
      <CardBody className="space-y-4">
        {steps.length === 0 ? (
          <p className="text-body-muted">No replay steps attached to this bug.</p>
        ) : (
          <>
            <ReplayInspector
              steps={steps}
              activeStepIndex={null}
              selectedStepIndex={selectedStepIndex}
              onSelectStep={setSelectedStepIndex}
              stepResults={stepResults}
              tone="stripe"
              truncated={truncated}
            />

            <ReplaySpeedControl value={stepDelayMs} onChange={setStepDelayMs} tone="stripe" />

            <Button data-testid="replay-start" onClick={handleReplay}>
              Replay in Test Playground
            </Button>

            {!hasPlaygroundSteps && steps.length > 0 && (
              <p className="text-sm leading-relaxed text-red-600">
                This recording may predate the Test Playground. Re-record with Bug Type UI.
              </p>
            )}

            {lastMessage && (
              <p className="text-body-muted" data-testid="replay-status-msg">
                {lastMessage}
              </p>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
