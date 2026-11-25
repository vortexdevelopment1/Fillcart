/**
 * Cloudinary image upload service for Fillkart Admin Dashboard.
 * 
 * Supports:
 * 1. Unsigned Cloudinary direct client-side upload via VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.
 * 2. Graceful fallback to client-side Data URL preview if Cloudinary credentials are not configured or upload fails.
 */

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'fillkart_products';

  // If Cloudinary cloud name is not configured in .env, fallback to local Data URL
  if (!cloudName) {
    console.info('Cloudinary cloud name (VITE_CLOUDINARY_CLOUD_NAME) not set, using Data URL fallback.');
    return fileToDataUrl(file);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'fillkart/products');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      console.warn('Cloudinary upload returned non-200, falling back to Data URL:', errJson);
      return fileToDataUrl(file);
    }

    const data = await response.json();
    return data.secure_url || data.url || fileToDataUrl(file);
  } catch (err) {
    console.warn('Cloudinary upload network error, falling back to Data URL:', err);
    return fileToDataUrl(file);
  }
}
