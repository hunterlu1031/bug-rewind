import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  getPlaygroundReturn,
  PLAYGROUND_ROOT_ID,
  savePlaygroundReturn,
} from '../constants/playground';
import { PocDisclaimer } from '../components/layout/PocDisclaimer';
import { HelpDialog } from '../components/help/HelpDialog';
import { useRecordingContext } from '../context/RecordingContext';
import { RecordingBanner } from '../components/recording/RecordingBanner';
import { RecordingControls } from '../components/recording/RecordingControls';
import { PlaygroundReplayStatus } from '../components/replay/PlaygroundReplayStatus';
import { useReplayContext } from '../context/ReplayContext';
import { PlaygroundInstructions } from './components/PlaygroundInstructions';
import { PlaygroundStoreNav } from './components/PlaygroundStoreNav';
import { PlaygroundStoreProvider } from './context/PlaygroundStoreContext';
import { PlaygroundReplayRunner } from './PlaygroundReplayRunner';

function PlaygroundChrome() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const { setRecordingAllowed, setPlaygroundRoot, isRecording } = useRecordingContext();
  const { isReplaying, replayComplete, replayFailed } = useReplayContext();
  const rootRef = useRef(null);
  const returnPath = getPlaygroundReturn('/');

  useEffect(() => {
    if (location.state?.returnTo) {
      savePlaygroundReturn(location.state.returnTo);
    }
  }, [location.state?.returnTo]);

  useEffect(() => {
    setRecordingAllowed(true);
  }, [setRecordingAllowed]);

  useEffect(() => {
    if (rootRef.current) setPlaygroundRoot(rootRef.current);
  }, [setPlaygroundRoot]);

  const showRecordingControls = !isReplaying && !replayComplete && !replayFailed;

  return (
    <div className="playground-shell">
      <PocDisclaimer variant="playground" />

      <header className="sticky top-0 z-30 border-b border-pg-line/60 bg-pg-surface/90 shadow-pg backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pg-accent">
                Test Playground
              </p>
              <p className="text-sm text-pg-muted">System under test · ShopDemo retail simulation</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-testid="playground-help-button"
                onClick={() => setHelpOpen(true)}
                className="rounded-xl border border-pg-line bg-pg-surface px-4 py-2 text-sm font-medium text-pg-accent shadow-sm hover:bg-pg-accent-soft"
              >
                Help
              </button>
              <Link
                to={returnPath}
                data-testid="playground-chrome-back"
                className="rounded-xl border border-pg-line bg-pg-surface px-4 py-2 text-sm font-medium text-pg-ink shadow-sm hover:bg-pg-bg"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
        {isRecording && <RecordingBanner />}
      </header>

      <div className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-6 sm:px-8 lg:px-12">
        <PlaygroundInstructions />
        {(isReplaying || replayComplete || replayFailed) && <PlaygroundReplayStatus />}
        {showRecordingControls && <RecordingControls compact />}
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-12 sm:px-8 lg:px-12">
        <div
          id={PLAYGROUND_ROOT_ID}
          ref={rootRef}
          data-testid={PLAYGROUND_ROOT_ID}
          className="min-h-[640px] overflow-hidden rounded-3xl border border-pg-glow/50 bg-pg-surface shadow-pg-lg ring-1 ring-pg-line/50 sm:min-h-[720px]"
        >
          <PlaygroundStoreNav />
          <div className="px-6 pb-10 pt-2 sm:px-10 lg:px-12">
            <Outlet />
          </div>
        </div>
      </div>

      <PlaygroundReplayRunner />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} tone="playground" />
    </div>
  );
}

export function PlaygroundLayout() {
  return (
    <PlaygroundStoreProvider>
      <PlaygroundChrome />
    </PlaygroundStoreProvider>
  );
}
