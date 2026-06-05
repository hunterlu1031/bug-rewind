import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '../constants/attachments';

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: 'Use JPEG, PNG, GIF, or WebP images only.' };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: `Image must be ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} or smaller.`,
    };
  }
  return { ok: true };
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export async function fileToBugAttachment(file) {
  const validation = validateImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }
  const dataUrl = await readFileAsDataUrl(file);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    dataUrl,
    uploadedAt: new Date().toISOString(),
  };
}
