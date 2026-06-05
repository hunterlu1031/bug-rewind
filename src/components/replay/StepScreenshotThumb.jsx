import { PreviewableImage } from '../ui/PreviewableImage';
import { resolveImageUrl } from '../../utils/imagePreview';

export function StepScreenshotThumb({ screenshot, alt = 'Step screenshot', className = '' }) {
  const imageUrl = resolveImageUrl(screenshot);
  if (!imageUrl) return null;

  return (
    <PreviewableImage
      src={imageUrl}
      alt={alt}
      className={`max-h-28 w-full object-cover object-top bg-white ${className}`}
      buttonClassName={`mt-2 block w-full cursor-pointer overflow-hidden rounded-md border border-stripe-border/80 bg-transparent p-0 text-left ${className}`}
      data-testid="step-screenshot-thumb"
    />
  );
}
