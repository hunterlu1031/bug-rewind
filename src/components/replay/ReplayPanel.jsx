import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clampReplayDelay,
  DEFAULT_REPLAY_DELAY_MS,
  savePlaygroundReturn,
} from '../../constants/playground';
import { useReplayContext } from '../../context/ReplayContext';
import { getReplayStartPath } from '../../utils/replayLaunch';
import { labelForStep } from '../../utils/selectors';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { ReplaySpeedControl } from './ReplaySpeedControl';

export function ReplayPanel({ bug }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { queueReplay } = useReplayContext();
  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_REPLAY_DELAY_MS);
  const [lastMessage, setLastMessage] = useState('');

  const steps = bug.replaySteps || [];
  const hasPlaygroundSteps = steps.some((s) => s.testId?.startsWith('pg-'));

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
        subtitle="Runs in the Test Playground. Adjust speed below; replay again from the playground when done."
      />
      <CardBody className="space-y-4">
        {steps.length === 0 ? (
          <p className="text-sm text-stripe-muted">No replay steps attached to this bug.</p>
        ) : (
          <>
            <ReplaySpeedControl value={stepDelayMs} onChange={setStepDelayMs} tone="stripe" />

            <Button data-testid="replay-start" onClick={handleReplay}>
              Replay in Test Playground
            </Button>

            {!hasPlaygroundSteps && steps.length > 0 && (
              <p className="text-sm text-red-600">
                This recording may predate the Test Playground. Re-record with Bug Type UI.
              </p>
            )}

            {lastMessage && (
              <p className="text-sm text-stripe-muted" data-testid="replay-status-msg">
                {lastMessage}
              </p>
            )}

            <div className="rounded-lg border border-stripe-border bg-stripe-bg p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stripe-muted">
                Timeline
              </p>
              <ol className="space-y-2 text-sm">
                {steps.map((step, i) => (
                  <li key={`replay-${i}-${step.timestamp}`} className="text-stripe-muted">
                    {i + 1}. {step.label || labelForStep(step)}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
