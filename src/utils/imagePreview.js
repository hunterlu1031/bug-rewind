/**
 * Normalize image input to a data URL string.
 * Supports raw strings, attachment objects { dataUrl }, and step { screenshot }.
 */
export function resolveImageUrl(image) {
  if (!image) return null;

  if (typeof image === 'string') {
    return isValidDataImageUrl(image) ? image : null;
  }

  if (typeof image === 'object') {
    if (typeof image.dataUrl === 'string' && isValidDataImageUrl(image.dataUrl)) {
      return image.dataUrl;
    }
    if (typeof image.screenshot === 'string' && isValidDataImageUrl(image.screenshot)) {
      return image.screenshot;
    }
  }

  return null;
}

export function isValidDataImageUrl(imageUrl) {
  return (
    typeof imageUrl === 'string'
    && imageUrl.startsWith('data:image')
    && imageUrl.length > 22
  );
}

/** Convert data URL to a short blob: URL safe for window.open (avoids huge href limits). */
export function dataUrlToBlobUrl(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) throw new Error('Invalid data URL');

  const header = dataUrl.slice(0, comma);
  const base64 = dataUrl.slice(comma + 1);
  const mime = header.match(/data:([^;]+)/)?.[1] || 'image/png';

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

let previewListener = null;

/** Register overlay handler (mounted once at app root). */
export function registerImagePreviewListener(listener) {
  previewListener = listener;
  return () => {
    if (previewListener === listener) previewListener = null;
  };
}

/**
 * Open image in new tab via blob URL (no empty window + no document access needed).
 */
export function openImageInNewTab(dataUrl) {
  const imageUrl = resolveImageUrl(dataUrl);
  if (!imageUrl) return false;

  let blobUrl = null;
  try {
    blobUrl = dataUrlToBlobUrl(imageUrl);
  } catch {
    return false;
  }

  const win = window.open(blobUrl, '_blank');
  if (!win) {
    URL.revokeObjectURL(blobUrl);
    return false;
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
  return true;
}

/**
 * Show validated image preview (in-app overlay; never opens about:blank).
 */
export function openImagePreview(imageOrUrl) {
  const imageUrl = resolveImageUrl(imageOrUrl);
  if (!imageUrl) return;

  if (previewListener) {
    previewListener(imageUrl);
    return;
  }

  if (!openImageInNewTab(imageUrl)) {
    console.warn('[imagePreview] Could not open preview — no listener and popup blocked.');
  }
}
