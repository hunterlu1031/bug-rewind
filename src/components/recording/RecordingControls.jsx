import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getPlaygroundReturn } from '../../constants/playground';
import { useRecordingContext } from '../../context/RecordingContext';
import { useReplayContext } from '../../context/ReplayContext';
import { RecordingPreview } from '../replay/RecordingPreview';
import { MAX_SCREENSHOTS_PER_RECORDING } from '../../constants/recording';
import { launchRecordingPreviewReplay } from '../../utils/recordingPreviewReplay';

function PlaygroundRecordingBody({
  isRecording,
  steps,
  hasFinalized,
  finalizedSteps,
  startRecording,
  stopRecording,
  clearRecording,
  showStepsPreview,
  onPreviewInShopDemo,
  canPreviewReplay,
  screenshotCount,
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {!isRecording ? (
          <button
            type="button"
            data-testid="recording-start"
            onClick={startRecording}
            className="rounded-xl bg-pg-accent px-4 py-2 text-sm font-medium text-white shadow-md shadow-pg-accent/20 hover:bg-pg-accent-hover"
          >
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            data-testid="recording-stop"
            onClick={() => stopRecording()}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
        {(steps.length > 0 || hasFinalized) && (
          <button
            type="button"
            data-testid="recording-clear"
            onClick={clearRecording}
            className="rounded-xl border border-pg-line bg-pg-surface px-4 py-2 text-sm font-medium text-pg-ink hover:bg-pg-bg"
          >
            Clear Recording
          </button>
        )}
        {hasFinalized && (
          <Link
            to="/bugs/new"
            state={{ returnTo: getPlaygroundReturn('/') }}
            data-testid="recording-return-create"
          >
            <span className="inline-flex rounded-xl border border-pg-glow bg-pg-accent-soft px-4 py-2 text-sm font-medium text-pg-accent hover:bg-pg-glow/40">
              Save bug with recording →
            </span>
          </Link>
        )}
      </div>

      {isRecording && (
        <p className="text-sm text-red-700">
          Recording active — interact with ShopDemo inside the box below.
          {' '}
          Screenshots: {screenshotCount}/{MAX_SCREENSHOTS_PER_RECORDING} (clicks, navigation, submit, stop).
        </p>
      )}

      {hasFinalized && (
        <div className="space-y-3" data-testid="playground-finalized-recording">
          <p className="text-sm text-emerald-700">
            Recording finalized ({finalizedSteps.length} steps). Review below before saving to a
            bug.
          </p>
          <RecordingPreview steps={finalizedSteps} tone="playground" defaultExpanded />
          {canPreviewReplay && (
            <button
              type="button"
              data-testid="playground-preview-recording"
              onClick={onPreviewInShopDemo}
              className="rounded-xl bg-pg-accent px-4 py-2 text-sm font-medium text-white shadow-md shadow-pg-accent/20 hover:bg-pg-accent-hover"
            >
              Preview in ShopDemo
            </button>
          )}
        </div>
      )}

      {showStepsPreview && isRecording && steps.length > 0 && (
        <div data-testid="recording-steps-preview" className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-pg-muted">
            Captured so far
          </p>
          <RecordingPreview steps={steps} tone="playground" defaultExpanded />
        </div>
      )}
    </>
  );
}

export function RecordingControls({ compact = false, showStepsPreview = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isRecording,
    finalizedSteps,
    displaySteps,
    startRecording,
    stopRecording,
    clearRecording,
    screenshotCount,
  } = useRecordingContext();
  const { queueReplay, isReplaying, replayComplete, replayFailed } = useReplayContext();

  const steps = displaySteps;
  const hasFinalized = !isRecording && finalizedSteps.length > 0;
  const canPreviewReplay =
    hasFinalized && !isReplaying && !replayComplete && !replayFailed;

  const previewInShopDemo = () => {
    launchRecordingPreviewReplay({
      steps: finalizedSteps,
      returnPath: location.pathname,
      navigate,
      queueReplay,
    });
  };

  if (compact) {
    return (
      <div data-testid="recording-controls-card" className="pg-card p-5">
        <p className="mb-3 text-sm font-semibold text-pg-ink">QA Recording</p>
        <PlaygroundRecordingBody
          isRecording={isRecording}
          steps={steps}
          hasFinalized={hasFinalized}
          finalizedSteps={finalizedSteps}
          startRecording={startRecording}
          stopRecording={stopRecording}
          clearRecording={clearRecording}
          showStepsPreview={showStepsPreview}
          onPreviewInShopDemo={previewInShopDemo}
          canPreviewReplay={canPreviewReplay}
          screenshotCount={screenshotCount}
        />
      </div>
    );
  }

  return (
    <div data-testid="recording-controls-card" className="pg-card p-5">
      <p className="mb-1 text-sm font-semibold text-pg-ink">Interaction Recording</p>
      <p className="mb-4 text-sm text-pg-muted">Record only inside the Test Playground (ShopDemo SUT).</p>
      <PlaygroundRecordingBody
        isRecording={isRecording}
        steps={steps}
        hasFinalized={hasFinalized}
        finalizedSteps={finalizedSteps}
        startRecording={startRecording}
        stopRecording={stopRecording}
        clearRecording={clearRecording}
        showStepsPreview={showStepsPreview}
        onPreviewInShopDemo={previewInShopDemo}
        canPreviewReplay={canPreviewReplay}
        screenshotCount={screenshotCount}
      />
    </div>
  );
}
