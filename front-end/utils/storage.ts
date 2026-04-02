/**
 * Resolves a storage path from the database into a full, absolute URL for use in Next.js Image components.
 * 
 * @param path The relative storage path (e.g., 'raw/69cd..._poster.jpg')
 * @returns A full URL or the original path if it's already an absolute URL.
 */
export const resolveStorageUrl = (path: string | undefined | null): string => {
  if (!path) return "";
  
  // If it's already an absolute URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Use the environment variable for the base storage URL, with a fallback for local development
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:9000/videos";
  
  // Ensure the path starts with a slash if needed, unless the baseUrl already has it
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}/${cleanPath}`;
};
