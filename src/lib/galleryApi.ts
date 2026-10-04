import { supabase } from "./supabase";

const GALLERY_BUCKET = "gallery";

/** Upload file to Cloudinary; returns secure URL. */
export async function uploadGalleryImage(
  file: File,
  folder = ""
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials are not configured in .env (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // Note: removing 'folder' parameter as it can cause 400 Bad Request if the unsigned preset doesn't allow dynamic folders.

  // Using "auto" handles both images and videos seamlessly
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}

export async function insertGalleryImageRecord(imageUrl: string): Promise<void> {
  const { error } = await supabase.from("gallery_images").insert([{ image_url: imageUrl }]);
  if (error) {
    throw new Error(error.message || "Failed to save image record");
  }
}

export async function fetchGalleryImageRecords() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteGalleryImageRecord(id: string, imageUrl: string): Promise<void> {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Cloudinary deletions require an API Secret which should never be exposed on the frontend.
  // Files will remain in Cloudinary unless deleted via a backend service or the Cloudinary dashboard.
  console.warn("Storage delete skipped: Cloudinary frontend deletion is not securely supported without a backend.");
}


