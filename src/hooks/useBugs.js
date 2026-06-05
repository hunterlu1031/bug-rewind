import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEMO_USER_NAME } from '../constants/user';
import { MAX_BUG_IMAGES } from '../constants/attachments';
import { fileToBugAttachment } from '../utils/imageAttachments';
import {
  clearAllBugs,
  generateBugId,
  loadBugs,
  saveBugs,
} from '../services/bugStorage';
import { normalizeReplaySteps } from '../utils/replaySteps';
import { removeBugFromAllTestRuns } from '../services/storageService';
import { getAppStorageUsageInfo } from '../utils/storageManagement';

function canManageComment(comment) {
  return (comment.author || DEMO_USER_NAME) === DEMO_USER_NAME;
}

export function useBugs() {
  const [bugs, setBugs] = useState(() => loadBugs());
  const [storageRevision, setStorageRevision] = useState(0);

  useEffect(() => {
    saveBugs(bugs);
    setStorageRevision((n) => n + 1);
  }, [bugs]);

  const refreshStorageMetrics = useCallback(() => {
    setStorageRevision((n) => n + 1);
  }, []);

  const reloadFromStorage = useCallback(() => {
    setBugs(loadBugs());
    setStorageRevision((n) => n + 1);
  }, []);

  const appStorageUsage = useMemo(
    () => getAppStorageUsageInfo(),
    [storageRevision, bugs],
  );

  const bugStorageUsage = appStorageUsage;

  const addBug = useCallback((bugData) => {
    setBugs((prev) => {
      const id = generateBugId(prev);
      const bug = {
        ...bugData,
        id,
        createdAt: new Date().toISOString(),
        createdBy: bugData.createdBy || DEMO_USER_NAME,
        replaySteps: normalizeReplaySteps(bugData.replaySteps || []),
        assignee: bugData.assignee || '',
        comments: bugData.comments || [],
        closeResolution: bugData.closeResolution || '',
        attachments: bugData.attachments || [],
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
    removeBugFromAllTestRuns(id);
    setBugs((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const deleteBugs = useCallback((ids) => {
    const idSet = new Set((ids || []).map(String));
    if (idSet.size === 0) return;
    for (const id of idSet) {
      removeBugFromAllTestRuns(id);
    }
    setBugs((prev) => prev.filter((b) => !idSet.has(String(b.id))));
  }, []);

  const clearBugs = useCallback(() => {
    clearAllBugs();
    setBugs([]);
    setStorageRevision((n) => n + 1);
  }, []);

  const getBugById = useCallback(
    (id) => bugs.find((b) => String(b.id) === String(id)),
    [bugs],
  );

  const addBugComment = useCallback((id, text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    setBugs((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              comments: [
                ...(b.comments || []),
                {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  author: DEMO_USER_NAME,
                  text: trimmed,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : b,
      ),
    );
  }, []);

  const updateBugComment = useCallback((bugId, commentId, text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    setBugs((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              comments: (b.comments || []).map((c) =>
                c.id === commentId && canManageComment(c)
                  ? { ...c, text: trimmed, editedAt: new Date().toISOString() }
                  : c,
              ),
            }
          : b,
      ),
    );
  }, []);

  const deleteBugComment = useCallback((bugId, commentId) => {
    setBugs((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              comments: (b.comments || []).filter(
                (c) => !(c.id === commentId && canManageComment(c)),
              ),
            }
          : b,
      ),
    );
  }, []);

  const addBugImage = useCallback(async (bugId, file) => {
    const attachment = await fileToBugAttachment(file);

    setBugs((prev) =>
      prev.map((b) => {
        if (b.id !== bugId) return b;
        const existing = b.attachments || [];
        if (existing.length >= MAX_BUG_IMAGES) return b;
        return { ...b, attachments: [...existing, attachment] };
      }),
    );
  }, []);

  const replaceBugImage = useCallback(async (bugId, imageId, file) => {
    const attachment = await fileToBugAttachment(file);

    setBugs((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              attachments: (b.attachments || []).map((img) =>
                img.id === imageId ? { ...attachment, id: imageId } : img,
              ),
            }
          : b,
      ),
    );
  }, []);

  const deleteBugImage = useCallback((bugId, imageId) => {
    setBugs((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              attachments: (b.attachments || []).filter((img) => img.id !== imageId),
            }
          : b,
      ),
    );
  }, []);

  return {
    bugs,
    appStorageUsage,
    bugStorageUsage,
    refreshStorageMetrics,
    reloadFromStorage,
    addBug,
    updateBug,
    deleteBug,
    deleteBugs,
    clearBugs,
    getBugById,
    addBugComment,
    updateBugComment,
    deleteBugComment,
    addBugImage,
    replaceBugImage,
    deleteBugImage,
  };
}
