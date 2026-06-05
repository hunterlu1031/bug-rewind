import { useRef, useState } from 'react';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_BUG_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
} from '../../constants/attachments';
import { useBugsContext } from '../../context/BugsContext';
import { formatFileSize, validateImageFile } from '../../utils/imageAttachments';
import { resolveImageUrl } from '../../utils/imagePreview';
import { PreviewableImage } from '../ui/PreviewableImage';
import { formatBytes } from '../../utils/storageSize';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function BugImageAttachments({
  attachments = [],
  onAdd,
  onReplace,
  onDelete,
}) {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [replacingId, setReplacingId] = useState(null);
  const [error, setError] = useState('');
  const { bugStorageUsage } = useBugsContext();

  const atLimit = attachments.length >= MAX_BUG_IMAGES;
  const storageBlocked = bugStorageUsage?.blockImages;
  const storageWarning = bugStorageUsage?.isWarning;

  const confirmStorageForImage = () => {
    if (storageBlocked) {
      setError(
        `Cannot add images — storage is at ${formatBytes(bugStorageUsage.bytes)}. Delete old bugs or remove screenshots first.`,
      );
      return false;
    }
    if (storageWarning) {
      const ok = window.confirm(
        `Bug storage is ${formatBytes(bugStorageUsage.bytes)} (over 4 MB). Base64 images fill localStorage quickly. Add this image anyway? Consider deleting old bugs or attachments first.`,
      );
      if (!ok) return false;
    }
    return true;
  };

  const runFile = async (file, handler) => {
    if (!confirmStorageForImage()) return;

    const validation = validateImageFile(file);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }
    try {
      await handler(file);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not process image.');
    }
  };

  const handleAddChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    runFile(file, onAdd);
  };

  const handleReplaceChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const imageId = replacingId;
    setReplacingId(null);
    if (!file || !imageId) return;
    runFile(file, (f) => onReplace(imageId, f));
  };

  const startReplace = (imageId) => {
    setReplacingId(imageId);
    replaceInputRef.current?.click();
  };

  return (
    <Card data-testid="bug-images-card">
      <CardHeader
        title="Attachments"
        subtitle={`${attachments.length} / ${MAX_BUG_IMAGES} images · max ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} each`}
      />
      <CardBody className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_EXTENSIONS}
          className="hidden"
          data-testid="bug-image-add-input"
          onChange={handleAddChange}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept={ALLOWED_IMAGE_EXTENSIONS}
          className="hidden"
          data-testid="bug-image-replace-input"
          onChange={handleReplaceChange}
        />

        {attachments.length === 0 ? (
          <p className="text-sm text-stripe-muted" data-testid="bug-images-empty">
            No images attached. Add screenshots to document the bug.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="bug-images-list">
            {attachments.map((img) => {
              const imageUrl = resolveImageUrl(img);
              if (!imageUrl) return null;

              return (
              <li
                key={img.id}
                className="overflow-hidden rounded-lg border border-stripe-border bg-stripe-bg"
                data-testid={`bug-image-${img.id}`}
              >
                <PreviewableImage
                  src={imageUrl}
                  alt={img.name || 'Bug attachment'}
                  className="h-40 w-full object-cover bg-stripe-surface"
                  buttonClassName="block w-full cursor-pointer border-0 bg-transparent p-0"
                  data-testid={`bug-image-preview-${img.id}`}
                />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium text-stripe-ink" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-xs text-stripe-faint">{formatFileSize(img.size)}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      data-testid={`bug-image-replace-${img.id}`}
                      onClick={() => startReplace(img.id)}
                      className="text-xs font-medium text-stripe-accent hover:underline"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      data-testid={`bug-image-delete-${img.id}`}
                      onClick={() => {
                        if (window.confirm('Remove this image?')) onDelete(img.id);
                      }}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
          </ul>
        )}

        {storageWarning && !storageBlocked && (
          <p className="text-sm text-amber-800" data-testid="bug-images-storage-hint">
            Storage is high ({bugStorageUsage.label}). New screenshots may push localStorage over its limit.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600" data-testid="bug-images-error">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="secondary"
          data-testid="bug-image-add-button"
          disabled={atLimit || storageBlocked}
          onClick={() => fileInputRef.current?.click()}
        >
          {storageBlocked
            ? 'Storage full — cannot attach'
            : atLimit
              ? `Maximum ${MAX_BUG_IMAGES} images`
              : 'Attach image'}
        </Button>
      </CardBody>
    </Card>
  );
}
