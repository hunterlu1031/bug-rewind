import { useCallback, useEffect, useState } from 'react';
import {
  clearAllBugs,
  generateBugId,
  loadBugs,
  saveBugs,
} from '../services/bugStorage';

export function useBugs() {
  const [bugs, setBugs] = useState(() => loadBugs());

  useEffect(() => {
    saveBugs(bugs);
  }, [bugs]);

  const addBug = useCallback((bugData) => {
    setBugs((prev) => {
      const id = generateBugId(prev);
      const bug = {
        ...bugData,
        id,
        createdAt: new Date().toISOString(),
        replaySteps: bugData.replaySteps || [],
      };
      return [bug, ...prev];
    });
  }, []);

  const updateBug = useCallback((id, updates) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  }, []);

  const deleteBug = useCallback((id) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clearBugs = useCallback(() => {
    clearAllBugs();
    setBugs([]);
  }, []);

  const getBugById = useCallback(
    (id) => bugs.find((b) => String(b.id) === String(id)),
    [bugs],
  );

  return {
    bugs,
    addBug,
    updateBug,
    deleteBug,
    clearBugs,
    getBugById,
  };
}
