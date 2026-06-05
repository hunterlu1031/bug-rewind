import html2canvas from 'html2canvas';
import { PLAYGROUND_DOM_ID, PLAYGROUND_ROOT_ID } from '../constants/playground';
import {
  MAX_SCREENSHOTS_PER_RECORDING,
  SCREENSHOT_DEBOUNCE_MS,
} from '../constants/recording';

/**
 * Resolves the Test Playground capture root (#playground per spec, with legacy fallback).
 */
export function getPlaygroundCaptureElement() {
  return (
    document.querySelector(`#${PLAYGROUND_DOM_ID}`)
    || document.getElementById(PLAYGROUND_ROOT_ID)
  );
}

class ScreenshotManager {
  constructor() {
    this.screenshotCount = 0;
    this.lastCaptureAt = new Map();
    this.inFlight = false;
  }

  reset() {
    this.screenshotCount = 0;
    this.lastCaptureAt.clear();
    this.inFlight = false;
  }

  getCount() {
    return this.screenshotCount;
  }

  canCapture() {
    return (
      this.screenshotCount < MAX_SCREENSHOTS_PER_RECORDING
      && !this.inFlight
    );
  }

  shouldDebounce(captureKey) {
    if (!captureKey) return false;
    const last = this.lastCaptureAt.get(captureKey);
    return last != null && Date.now() - last < SCREENSHOT_DEBOUNCE_MS;
  }

  /**
   * Capture playground as PNG data URL. Returns null on failure or limits.
   */
  async capturePlaygroundScreenshot() {
    if (!this.canCapture()) return null;

    const element = getPlaygroundCaptureElement();
    if (!element) return null;

    this.inFlight = true;
    let canvas = null;

    try {
      canvas = await html2canvas(element, {
        logging: false,
        scale: Math.min(1, window.devicePixelRatio || 1),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      const dataUrl = canvas.toDataURL('image/png');
      this.screenshotCount += 1;
      return dataUrl;
    } catch (err) {
      console.warn('[ScreenshotManager] Capture failed:', err);
      return null;
    } finally {
      this.inFlight = false;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  }

  /**
   * Event-driven capture with debounce and max count.
   * @param {string} captureKey e.g. testId or navigation path
   */
  async captureForEvent(captureKey) {
    if (!this.canCapture() || this.shouldDebounce(captureKey)) {
      return null;
    }

    const screenshot = await this.capturePlaygroundScreenshot();
    if (screenshot) {
      this.lastCaptureAt.set(captureKey, Date.now());
    }
    return screenshot;
  }
}

export const screenshotManager = new ScreenshotManager();
