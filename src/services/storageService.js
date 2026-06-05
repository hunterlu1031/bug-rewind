import {
  MAX_BUG_IDS_PER_RUN,
  MAX_TEST_RUNS,
  TEST_RUNS_STORAGE_KEY,
} from '../constants/testRuns';

function generateTestRunId() {
  return `tr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeBugIds(bugIds) {
  if (!Array.isArray(bugIds)) return [];
  const seen = new Set();
  const normalized = [];
  for (const id of bugIds) {
    const key = String(id);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    normalized.push(key);
    if (normalized.length >= MAX_BUG_IDS_PER_RUN) break;
  }
  return normalized;
}

function normalizeTestRun(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = raw.id != null ? String(raw.id) : '';
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!id || !name) return null;

  return {
    id,
    name,
    description: typeof raw.description === 'string' ? raw.description : '',
    bugIds: normalizeBugIds(raw.bugIds),
    createdAt:
      typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt)
        ? raw.createdAt
        : Date.now(),
  };
}

function parseTestRuns(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTestRun).filter(Boolean);
  } catch {
    return [];
  }
}

export const TEST_RUNS_CHANGED_EVENT = 'test-runs-changed';

function notifyTestRunsChanged() {
  window.dispatchEvent(new Event(TEST_RUNS_CHANGED_EVENT));
}

function persistTestRuns(runs) {
  localStorage.setItem(TEST_RUNS_STORAGE_KEY, JSON.stringify(runs));
  notifyTestRunsChanged();
}

export function getAllTestRuns() {
  try {
    return parseTestRuns(localStorage.getItem(TEST_RUNS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function getTestRunById(id) {
  return getAllTestRuns().find((run) => run.id === String(id)) ?? null;
}

export function createTestRun({ name, description = '' }) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    return { ok: false, error: 'Test run name is required.' };
  }

  const runs = getAllTestRuns();
  if (runs.length >= MAX_TEST_RUNS) {
    return {
      ok: false,
      error: `Maximum of ${MAX_TEST_RUNS} test runs reached.`,
    };
  }

  const run = {
    id: generateTestRunId(),
    name: trimmedName,
    description: (description || '').trim(),
    bugIds: [],
    createdAt: Date.now(),
  };

  persistTestRuns([run, ...runs]);
  return { ok: true, run };
}

export function updateTestRun(id, updates = {}) {
  const runId = String(id);
  const runs = getAllTestRuns();
  const index = runs.findIndex((r) => r.id === runId);
  if (index === -1) {
    return { ok: false, error: 'Test run not found.' };
  }

  const current = runs[index];
  let nextBugIds = current.bugIds;

  if (updates.bugIds !== undefined) {
    nextBugIds = normalizeBugIds(updates.bugIds);
  }

  const updated = {
    ...current,
    name:
      updates.name !== undefined ? String(updates.name).trim() || current.name : current.name,
    description:
      updates.description !== undefined
        ? String(updates.description).trim()
        : current.description,
    bugIds: nextBugIds,
  };

  if (!updated.name) {
    return { ok: false, error: 'Test run name cannot be empty.' };
  }

  const next = [...runs];
  next[index] = updated;
  persistTestRuns(next);
  return { ok: true, run: updated };
}

export function deleteTestRun(id) {
  const runId = String(id);
  const runs = getAllTestRuns();
  const next = runs.filter((r) => r.id !== runId);
  if (next.length === runs.length) {
    return { ok: false, error: 'Test run not found.' };
  }
  persistTestRuns(next);
  return { ok: true };
}

export function addBugToTestRun(runId, bugId) {
  const run = getTestRunById(runId);
  if (!run) return { ok: false, error: 'Test run not found.' };

  const bugKey = String(bugId);
  if (run.bugIds.includes(bugKey)) {
    return { ok: true, run, alreadyLinked: true };
  }

  if (run.bugIds.length >= MAX_BUG_IDS_PER_RUN) {
    return {
      ok: false,
      error: `Maximum of ${MAX_BUG_IDS_PER_RUN} bugs per test run reached.`,
    };
  }

  return updateTestRun(runId, { bugIds: [...run.bugIds, bugKey] });
}

export function removeBugFromTestRun(runId, bugId) {
  const run = getTestRunById(runId);
  if (!run) return { ok: false, error: 'Test run not found.' };

  const bugKey = String(bugId);
  return updateTestRun(runId, {
    bugIds: run.bugIds.filter((id) => id !== bugKey),
  });
}

export function removeBugFromAllTestRuns(bugId) {
  const bugKey = String(bugId);
  const runs = getAllTestRuns();
  let changed = false;

  const next = runs.map((run) => {
    const filtered = run.bugIds.filter((id) => id !== bugKey);
    if (filtered.length === run.bugIds.length) return run;
    changed = true;
    return { ...run, bugIds: filtered };
  });

  if (changed) persistTestRuns(next);
  return changed;
}
