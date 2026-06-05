import { openImagePreview, resolveImageUrl } from '../../utils/imagePreview';

/**
 * Clickable image thumbnail — uses safe preview (no anchor href to huge data URLs).
 */
export function PreviewableImage({
  src,
  alt = 'Image preview',
  className = '',
  buttonClassName = 'block w-full cursor-pointer border-0 bg-transparent p-0 text-left',
  'data-testid': dataTestId,
}) {
  const imageUrl = resolveImageUrl(src);
  if (!imageUrl) return null;

  return (
    <button
      type="button"
      className={buttonClassName}
      data-testid={dataTestId}
      onClick={() => openImagePreview(imageUrl)}
      aria-label={`Preview ${alt}`}
    >
      <img src={imageUrl} alt={alt} className={className} />
    </button>
  );
}
