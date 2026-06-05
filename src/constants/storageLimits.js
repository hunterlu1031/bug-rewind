/** Typical localStorage budget shown in the UI (5 MB). */
export const STORAGE_DISPLAY_LIMIT_BYTES = 5 * 1024 * 1024;

/** Show warning banner and confirm before new images. */
export const STORAGE_WARNING_BYTES = 4 * 1024 * 1024;

/** Block new image uploads when at or above this size. */
export const STORAGE_BLOCK_IMAGE_BYTES = STORAGE_DISPLAY_LIMIT_BYTES;

export const STORAGE_LEVEL_THRESHOLDS = {
  green: 1 * 1024 * 1024,
  yellow: 3 * 1024 * 1024,
  orange: 4.5 * 1024 * 1024,
};
