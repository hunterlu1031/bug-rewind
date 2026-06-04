import { useMemo } from 'react';
import { analyzeBug } from '../../ai/fakeAiEngine';
import { useBugsContext } from '../../context/BugsContext';
import { SeverityBadge } from '../ui/Badge';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function AiInsightsPanel({ bug }) {
  const { bugs } = useBugsContext();
  const insights = useMemo(() => analyzeBug(bug, bugs), [bug, bugs]);

  return (
    <Card data-testid="ai-insights-panel">
      <CardHeader title="AI Insights" subtitle="Rule-based analysis — no external APIs." />
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-stripe-border bg-stripe-bg p-4">
          <span className="text-sm text-stripe-muted">Confidence</span>
          <span data-testid="ai-confidence" className="text-lg font-semibold text-stripe-accent">
            {insights.confidence}%
          </span>
        </div>

        <InsightRow label="Suggested severity">
          <SeverityBadge severity={insights.suggestedSeverity} />
          {insights.suggestedSeverity !== bug.severity && (
            <span className="ml-2 text-xs text-stripe-muted">(current: {bug.severity})</span>
          )}
        </InsightRow>

        <InsightRow label="Possible root cause">
          <p data-testid="ai-root-cause" className="text-sm text-stripe-ink">
            {insights.rootCause}
          </p>
        </InsightRow>

        <InsightRow label="Rewritten summary">
          <p data-testid="ai-summary" className="text-sm italic text-stripe-muted">
            {insights.rewrittenSummary}
          </p>
        </InsightRow>

        <InsightRow label="Duplicate detection">
          {insights.duplicates.length === 0 ? (
            <p className="text-sm text-stripe-muted">No similar bugs detected.</p>
          ) : (
            <ul className="space-y-1 text-sm text-stripe-accent" data-testid="ai-duplicates">
              {insights.duplicates.map((d) => (
                <li key={d.id}>
                  This bug may be similar to bug #{d.id} — &quot;{d.title}&quot; (
                  {Math.round(d.score * 100)}% overlap)
                </li>
              ))}
            </ul>
          )}
        </InsightRow>
      </CardBody>
    </Card>
  );
}

function InsightRow({ label, children }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stripe-muted">{label}</p>
      {children}
    </div>
  );
}
