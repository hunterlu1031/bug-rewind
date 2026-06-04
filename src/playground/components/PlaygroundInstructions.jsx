export function PlaygroundInstructions() {

  return (

    <div data-testid="playground-instructions" className="pg-card p-5">

      <h3 className="text-sm font-semibold text-pg-ink">How to use the Test Playground</h3>

      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-pg-muted">

        <li>

          Click <strong className="text-pg-ink">Start Recording</strong> above, then interact only inside the

          ShopDemo area below (login → catalog → cart → checkout).

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

  );

}

