import { useRecordingContext } from '../../context/RecordingContext';

export function RecordingBanner() {
  const { temporarySteps, stopRecording } = useRecordingContext();

  return (
    <div
      data-testid="recording-banner"
      className="border-t border-red-200 bg-red-50 px-4 py-2 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
          </span>
          <span className="font-medium text-red-800">Recording in progress</span>
          <span className="text-red-700/80">
            — {temporarySteps.length} step{temporarySteps.length !== 1 ? 's' : ''} in Test Playground
          </span>
        </div>
        <button
          type="button"
          data-testid="recording-banner-stop"
          onClick={stopRecording}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Stop Recording
        </button>
      </div>
    </div>
  );
}
