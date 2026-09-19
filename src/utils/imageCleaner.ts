export interface CleanResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  cleanSize: number;
  format: string;
  filename: string;
}

export type SupportedFormat = 'original' | 'image/png' | 'image/jpeg' | 'image/webp';

/**
 * Strips all metadata, EXIF, C2PA Content Credentials, AI tags, and history
 * by performing a pure pixel-level copy onto a fresh HTML5 canvas.
 */
export async function cleanImagePixelLevel(
  file: File,
  targetFormat: SupportedFormat = 'original',
  quality: number = 0.95
): Promise<CleanResult> {
  // 1. Determine output MIME type
  let outputMimeType = file.type;
  if (targetFormat !== 'original') {
    outputMimeType = targetFormat;
  } else if (!outputMimeType || outputMimeType === 'application/octet-stream') {
    // Infer from file extension if mime type is missing
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') outputMimeType = 'image/jpeg';
    else if (ext === 'webp') outputMimeType = 'image/webp';
    else outputMimeType = 'image/png';
  }

  // Normalize supported types
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(outputMimeType)) {
    outputMimeType = 'image/png';
  }

  // 2. Decode image into memory using ImageBitmap or Image element
  let width = 0;
  let height = 0;
  let sourceDrawable: CanvasImageSource;

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      sourceDrawable = bitmap;
    } catch {
      // Fallback to Image element if createImageBitmap fails
      const img = await loadHtmlImage(file);
      width = img.naturalWidth;
      height = img.naturalHeight;
      sourceDrawable = img;
    }
  } else {
    const img = await loadHtmlImage(file);
    width = img.naturalWidth;
    height = img.naturalHeight;
    sourceDrawable = img;
  }

  if (width === 0 || height === 0) {
    throw new Error('Could not read image dimensions.');
  }

  // 3. Create a pristine, isolated canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', {
    alpha: outputMimeType !== 'image/jpeg',
    willReadFrequently: false,
  });

  if (!ctx) {
    throw new Error('Canvas 2D context is not supported in this browser.');
  }

  // For JPEG output, fill white background to prevent transparent areas from turning black
  if (outputMimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // 4. Pixel-level copy: draw uncompressed raw pixels into the isolated canvas
  ctx.drawImage(sourceDrawable, 0, 0, width, height);

  // Close ImageBitmap if used to free GPU memory
  if ('close' in sourceDrawable && typeof sourceDrawable.close === 'function') {
    sourceDrawable.close();
  }

  // 5. Re-encode strictly from raw canvas pixels without any metadata or C2PA headers
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to encode clean canvas into image blob.'));
      },
      outputMimeType,
      quality
    );
  });

  // 6. Generate a clean file name
  const extension = getExtensionForMime(outputMimeType);
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const cleanFilename = `clean_${baseName}.${extension}`;

  const cleanUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: cleanUrl,
    width,
    height,
    originalSize: file.size,
    cleanSize: blob.size,
    format: outputMimeType,
    filename: cleanFilename,
  };
}

function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };
    img.src = url;
  });
}

export function getExtensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/png':
    default:
      return 'png';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
