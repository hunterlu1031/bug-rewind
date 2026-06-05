import { PLAYGROUND_ROOT_ID } from '../constants/playground';

const CLICK_CURSOR_CLASS = 'replay-click-cursor';
const CLICK_ACTIVE_CLASS = 'replay-click-cursor--active';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function removeReplayClickCursor(rootEl) {
  const root = rootEl || document.getElementById(PLAYGROUND_ROOT_ID);
  if (!root) return;
  root.querySelectorAll(`.${CLICK_CURSOR_CLASS}`).forEach((el) => el.remove());
}

/**
 * Shows an animated cursor + ripple at the target element during replay clicks.
 * @param {Element} element
 * @param {Element | null} rootEl
 */
export async function showReplayClickAnimation(element, rootEl) {
  const root = rootEl || document.getElementById(PLAYGROUND_ROOT_ID);
  if (!root || !element) return;

  removeReplayClickCursor(root);

  const targetRect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  const cursor = document.createElement('div');
  cursor.className = CLICK_CURSOR_CLASS;
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.left = `${targetRect.left - rootRect.left + targetRect.width / 2}px`;
  cursor.style.top = `${targetRect.top - rootRect.top + targetRect.height / 2}px`;

  cursor.innerHTML = `
    <span class="replay-click-cursor__ripple"></span>
    <span class="replay-click-cursor__pointer"></span>
  `;

  root.appendChild(cursor);

  await new Promise((resolve) => requestAnimationFrame(resolve));
  cursor.classList.add(CLICK_ACTIVE_CLASS);

  await wait(520);
  removeReplayClickCursor(root);
}
