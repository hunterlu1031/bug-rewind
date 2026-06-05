import { SEVERITIES, STATUSES, BUG_TYPES } from '../constants/bugOptions';
import { RECENT_BUGS_LIMIT } from '../constants/analytics';
import { loadBugs } from '../services/bugStorage';

function sanitizeBugs(bugs) {
  if (!Array.isArray(bugs)) return [];
  return bugs.filter((b) => b && typeof b === 'object' && b.id != null);
}

/** Load bugs from localStorage with safe parsing (no duplicate analytics store). */
export function loadBugsForAnalytics() {
  try {
    return sanitizeBugs(loadBugs());
  } catch {
    return [];
  }
}

function countByField(bugs, field, allowedValues) {
  const counts = Object.fromEntries(allowedValues.map((v) => [v, 0]));
  for (const bug of bugs) {
    const key = bug[field];
    if (key && counts[key] != null) counts[key] += 1;
  }
  return counts;
}

export function groupBySeverity(bugs) {
  return countByField(sanitizeBugs(bugs), 'severity', SEVERITIES);
}

export function groupByStatus(bugs) {
  return countByField(sanitizeBugs(bugs), 'status', STATUSES);
}

export function groupByType(bugs) {
  return countByField(sanitizeBugs(bugs), 'type', BUG_TYPES);
}

export function getRecentBugs(bugs, limit = RECENT_BUGS_LIMIT) {
  const safe = sanitizeBugs(bugs);
  return [...safe]
    .sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    })
    .slice(0, Math.min(limit, RECENT_BUGS_LIMIT));
}

export function getBugStats(bugs) {
  const safe = sanitizeBugs(bugs);
  const bySeverity = groupBySeverity(safe);
  const byStatus = groupByStatus(safe);
  const byType = groupByType(safe);

  return {
    total: safe.length,
    bySeverity,
    byStatus,
    byType,
    withReplay: safe.filter((b) => (b.replaySteps?.length ?? 0) > 0).length,
    open: byStatus.Open ?? 0,
    closed: byStatus.Closed ?? 0,
    inProgress: byStatus['In Progress'] ?? 0,
    recentBugs: getRecentBugs(safe),
  };
}

export function countsToChartItems(counts, colorMap = {}) {
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    barClass: colorMap[label] || 'bg-stripe-accent',
  }));
}

export const SEVERITY_BAR_COLORS = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-red-500',
};

export const STATUS_BAR_COLORS = {
  Open: 'bg-stripe-accent',
  'In Progress': 'bg-sky-500',
  Closed: 'bg-slate-400',
};

export const TYPE_BAR_COLORS = {
  UI: 'bg-violet-500',
  API: 'bg-orange-500',
  Other: 'bg-slate-500',
};
