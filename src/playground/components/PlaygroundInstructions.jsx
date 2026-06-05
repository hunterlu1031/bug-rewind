import { useEffect, useState } from 'react';

export function PlaygroundInstructions({ defaultExpanded = true, forceCollapsed = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (forceCollapsed) setExpanded(false);
  }, [forceCollapsed]);

  return (
    <div data-testid="playground-instructions" className="pg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h3 className="text-sm font-semibold text-pg-ink">How to use the Test Playground</h3>
        <button
          type="button"
          data-testid="playground-instructions-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls="playground-instructions-content"
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-pg-accent hover:bg-pg-accent-soft"
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {expanded && (
        <div
          id="playground-instructions-content"
          className="border-t border-pg-line px-5 pb-5 pt-1"
          data-testid="playground-instructions-content"
        >
          <ol className="list-decimal space-y-2 pl-5 text-sm text-pg-muted">
            <li>
              Click <strong className="text-pg-ink">Start Recording</strong> above, then interact only inside the
              ShopDemo area below (catalog → cart → checkout).
            </li>
            <li>Reproduce the bug: click buttons, fill forms, and navigate between pages.</li>
            <li>
              Click <strong className="text-pg-ink">Stop Recording</strong> when finished. Steps are saved in memory until you
              attach them to a bug.
            </li>
            <li>
              Return to <strong className="text-pg-ink">Create Bug</strong> via Back or “Save bug with recording” to save your
              report with the captured steps.
            </li>
            <li>
              To replay a saved bug, open it in the tracker and use{' '}
              <strong className="text-pg-ink">Replay in Test Playground</strong>.
            </li>
          </ol>
          <p className="mt-3 text-xs text-pg-faint">
            The bug tracker chrome (header, recording panel) is not recorded — only ShopDemo inside the box.
          </p>
        </div>
      )}
    </div>
  );
}
