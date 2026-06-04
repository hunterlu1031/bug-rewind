import { Link } from 'react-router-dom';
import { useRecordingContext } from '../../context/RecordingContext';
import { labelForStep } from '../../utils/selectors';

function PlaygroundRecordingBody({
  isRecording,
  steps,
  hasFinalized,
  finalizedSteps,
  startRecording,
  stopRecording,
  clearRecording,
  showStepsPreview,
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
          <Link to="/bugs/new" data-testid="recording-return-create">
            <span className="inline-flex rounded-xl border border-pg-glow bg-pg-accent-soft px-4 py-2 text-sm font-medium text-pg-accent hover:bg-pg-glow/40">
              Save bug with recording →
            </span>
          </Link>
        )}
      </div>

      {isRecording && (
        <p className="text-sm text-red-700">
          Recording active — interact with ShopDemo inside the box below.
        </p>
      )}

      {hasFinalized && (
        <p className="text-sm text-emerald-700">
          Recording finalized ({finalizedSteps.length} steps). Return to Create Bug to save.
        </p>
      )}

      {showStepsPreview && steps.length > 0 && (
        <div
          data-testid="recording-steps-preview"
          className="rounded-xl border border-pg-line bg-pg-bg/80 p-3"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pg-muted">
            Captured steps
          </p>
          <ol className="max-h-48 space-y-1 overflow-y-auto font-mono text-xs text-pg-muted">
            {steps.map((step, i) => (
              <li key={`${step.timestamp}-${i}`}>
                {i + 1}. {step.label || labelForStep(step)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

export function RecordingControls({ compact = false, showStepsPreview = true }) {
  const {
    isRecording,
    finalizedSteps,
    displaySteps,
    startRecording,
    stopRecording,
    clearRecording,
  } = useRecordingContext();

  const steps = displaySteps;
  const hasFinalized = !isRecording && finalizedSteps.length > 0;

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
      />
    </div>
  );
}
