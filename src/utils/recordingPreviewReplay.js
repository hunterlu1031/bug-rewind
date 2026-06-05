import { DEFAULT_REPLAY_DELAY_MS, savePlaygroundReturn } from '../constants/playground';
import { getReplayStartPath } from './replayLaunch';

/** Queue and navigate to a live ShopDemo replay of captured steps (unsaved bug). */
export function launchRecordingPreviewReplay({
  steps,
  returnPath,
  navigate,
  queueReplay,
  stepDelayMs = DEFAULT_REPLAY_DELAY_MS,
}) {
  if (!steps?.length) return;

  const startPath = getReplayStartPath(steps);
  savePlaygroundReturn(returnPath);
  queueReplay({
    bugId: 'preview',
    steps,
    stepDelayMs,
    returnPath,
    startPath,
  });
  navigate(startPath, { state: { returnTo: returnPath } });
}
