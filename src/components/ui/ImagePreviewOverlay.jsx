import { useCallback, useEffect, useState } from 'react';
import {
  openImageInNewTab,
  registerImagePreviewListener,
} from '../../utils/imagePreview';

export function ImagePreviewOverlay() {
  const [imageUrl, setImageUrl] = useState(null);

  const close = useCallback(() => setImageUrl(null), []);

  useEffect(() => {
    return registerImagePreviewListener((url) => setImageUrl(url));
  }, []);

  useEffect(() => {
    if (!imageUrl) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [imageUrl, close]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      data-testid="image-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={close}
    >
      <div
        className="relative flex max-h-full max-w-full flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full max-w-3xl justify-end gap-2">
          <button
            type="button"
            data-testid="image-preview-open-tab"
            onClick={() => openImageInNewTab(imageUrl)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
          >
            Open in new tab
          </button>
          <button
            type="button"
            data-testid="image-preview-close"
            onClick={close}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
          >
            Close
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Image preview"
          className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          data-testid="image-preview-full"
        />
      </div>
    </div>
  );
}
