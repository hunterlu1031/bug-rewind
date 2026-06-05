import { useCallback, useEffect, useState } from 'react';
import { TEST_RUNS_CHANGED_EVENT } from '../services/storageService';
import {
  addBugToTestRun,
  createTestRun,
  deleteTestRun,
  getAllTestRuns,
  getTestRunById,
  removeBugFromAllTestRuns,
  removeBugFromTestRun,
  updateTestRun,
} from '../services/storageService';

export function useTestRuns() {
  const [testRuns, setTestRuns] = useState(() => getAllTestRuns());

  const refresh = useCallback(() => {
    setTestRuns(getAllTestRuns());
  }, []);

  useEffect(() => {
    const onChanged = () => refresh();
    window.addEventListener(TEST_RUNS_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(TEST_RUNS_CHANGED_EVENT, onChanged);
  }, [refresh]);

  const create = useCallback(
    (payload) => {
      const result = createTestRun(payload);
      if (result.ok) refresh();
      return result;
    },
    [refresh],
  );

  const update = useCallback(
    (id, updates) => {
      const result = updateTestRun(id, updates);
      if (result.ok) refresh();
      return result;
    },
    [refresh],
  );

  const remove = useCallback(
    (id) => {
      const result = deleteTestRun(id);
      if (result.ok) refresh();
      return result;
    },
    [refresh],
  );

  const addBug = useCallback(
    (runId, bugId) => {
      const result = addBugToTestRun(runId, bugId);
      if (result.ok) refresh();
      return result;
    },
    [refresh],
  );

  const removeBug = useCallback(
    (runId, bugId) => {
      const result = removeBugFromTestRun(runId, bugId);
      if (result.ok) refresh();
      return result;
    },
    [refresh],
  );

  const pruneBugFromAllRuns = useCallback(
    (bugId) => {
      if (removeBugFromAllTestRuns(bugId)) refresh();
    },
    [refresh],
  );

  const getById = useCallback(
    (id) => testRuns.find((r) => r.id === String(id)) ?? getTestRunById(id),
    [testRuns],
  );

  const getRunsForBug = useCallback(
    (bugId) => {
      const key = String(bugId);
      return testRuns.filter((run) => run.bugIds.includes(key));
    },
    [testRuns],
  );

  return {
    testRuns,
    createTestRun: create,
    updateTestRun: update,
    deleteTestRun: remove,
    addBugToTestRun: addBug,
    removeBugFromTestRun: removeBug,
    pruneBugFromAllRuns,
    getTestRunById: getById,
    getTestRunsForBug: getRunsForBug,
    refreshTestRuns: refresh,
  };
}
