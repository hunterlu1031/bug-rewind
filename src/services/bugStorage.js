const STORAGE_KEY = 'bug-rewind-bugs';

export function loadBugs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBugs(bugs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
}

export function generateBugId(bugs) {
  const max = bugs.reduce((acc, b) => Math.max(acc, Number(b.id) || 0), 0);
  return max + 1;
}

export function clearAllBugs() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportBugAsJson(bug) {
  return JSON.stringify(bug, null, 2);
}

export function downloadJson(filename, data) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
