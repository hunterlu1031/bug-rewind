const HIGH_KEYWORDS = ['crash', 'broken', 'error 500', '500', 'fatal', 'down', 'unavailable', 'cannot login', "can't login"];
const MEDIUM_KEYWORDS = ['slow', 'lag', 'delay', 'timeout', 'intermittent', 'flaky'];
const LOW_KEYWORDS = ['typo', 'alignment', 'spacing', 'cosmetic', 'label', 'color', 'font'];

const AUTH_KEYWORDS = ['login', 'auth', 'sign in', 'signin', 'session', 'token', 'password', 'logout'];
const API_KEYWORDS = ['api', 'endpoint', 'fetch', 'request', 'response', '500', '404', 'network', 'cors'];
const UI_STATE_KEYWORDS = ['not updating', 'stale', 'state', 'rerender', 'refresh', 'blank screen', 'empty'];

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function containsAny(text, keywords) {
  return keywords.some((kw) => text.includes(kw));
}

export function suggestSeverity(title, description) {
  const text = normalize(`${title} ${description}`);
  if (containsAny(text, HIGH_KEYWORDS)) return 'High';
  if (containsAny(text, LOW_KEYWORDS)) return 'Low';
  if (containsAny(text, MEDIUM_KEYWORDS)) return 'Medium';
  if (text.includes('error') || text.includes('fail')) return 'High';
  return 'Medium';
}

export function suggestRootCause(title, description, bugType) {
  const text = normalize(`${title} ${description}`);
  if (containsAny(text, AUTH_KEYWORDS)) {
    return 'Possible authentication or session handling issue';
  }
  if (bugType === 'API' || containsAny(text, API_KEYWORDS)) {
    return 'Backend service or API failure likely';
  }
  if (containsAny(text, UI_STATE_KEYWORDS)) {
    return 'Frontend state management issue';
  }
  if (bugType === 'UI' || text.includes('button') || text.includes('layout')) {
    return 'UI rendering or component interaction issue';
  }
  return 'Requires further investigation; check logs and repro steps';
}

export function rewriteSummary(title, description) {
  const raw = normalize(description || title);
  if (!raw) return 'No description provided.';

  const templates = [
    {
      match: (t) => t.includes('login') && (t.includes('work') || t.includes('fail') || t.includes('broken')),
      out: 'User is unable to authenticate via login form; request fails during submission.',
    },
    {
      match: (t) => t.includes('crash') || t.includes('crash'),
      out: 'Application terminates unexpectedly during user workflow.',
    },
    {
      match: (t) => t.includes('slow') || t.includes('lag'),
      out: 'Observed performance degradation impacting user task completion time.',
    },
    {
      match: (t) => t.includes('api') || t.includes('500'),
      out: 'Client receives error response from dependent service during operation.',
    },
    {
      match: (t) => t.includes('typo') || t.includes('alignment'),
      out: 'Visual defect detected in UI presentation without functional blocker.',
    },
  ];

  for (const { match, out } of templates) {
    if (match(raw)) return out;
  }

  const subject = title ? title.trim() : 'Reported issue';
  const detail = description ? description.trim() : title;
  return `QA observation: ${subject}. ${detail.charAt(0).toUpperCase()}${detail.slice(1)}.`;
}

function tokenize(text) {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function jaccardSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection += 1;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export function findDuplicates(currentBug, allBugs) {
  const text = `${currentBug.title} ${currentBug.description}`;
  const matches = [];

  for (const bug of allBugs) {
    if (bug.id === currentBug.id) continue;
    const otherText = `${bug.title} ${bug.description}`;
    const score = jaccardSimilarity(text, otherText);
    if (score >= 0.35) {
      matches.push({ id: bug.id, title: bug.title, score });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function fakeConfidence(title, description, reproSteps) {
  let base = 70;
  if (title && title.length > 5) base += 8;
  if (description && description.length > 20) base += 7;
  if (reproSteps?.length > 0) base += Math.min(10, reproSteps.length * 2);
  return Math.min(95, base + (title.length % 6));
}

export function analyzeBug(bug, allBugs = []) {
  const reproText = (bug.replaySteps || [])
    .map((s) => s.label || s.value || s.path || '')
    .join(' ');

  const suggestedSeverity = suggestSeverity(bug.title, bug.description);
  const rootCause = suggestRootCause(bug.title, bug.description, bug.type);
  const rewrittenSummary = rewriteSummary(bug.title, bug.description);
  const duplicates = findDuplicates(bug, allBugs);
  const confidence = fakeConfidence(bug.title, bug.description, bug.replaySteps);

  return {
    suggestedSeverity,
    rootCause,
    rewrittenSummary,
    duplicates,
    confidence,
  };
}
