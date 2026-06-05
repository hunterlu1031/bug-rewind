import { QA_BUGS_STORAGE_KEY } from '../services/bugStorage';
import { TEST_RUNS_STORAGE_KEY } from './testRuns';

/** Keys owned by this app — never call localStorage.clear(). */
export const APP_STORAGE_KEYS = [
  QA_BUGS_STORAGE_KEY,
  'qa_bugs',
  TEST_RUNS_STORAGE_KEY,
];

/** Estimated browser localStorage budget for QA data (5 MB). */
export const ESTIMATED_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

/** Display upper bound in UI copy (5–10 MB range). */
export const ESTIMATED_STORAGE_LIMIT_MAX_BYTES = 10 * 1024 * 1024;

export const STORAGE_PERCENT_WARNING = 70;
export const STORAGE_PERCENT_DANGER = 85;
export const STORAGE_PERCENT_CRITICAL = 95;

export const DEFAULT_CLEAR_OLD_DAYS = 30;

export const DELETE_CONFIRM_TEXT = 'DELETE';
