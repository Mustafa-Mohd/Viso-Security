import { supabase } from "./supabase";

const GALLERY_BUCKET = "gallery";

/** Upload image to Supabase Storage `gallery` bucket; returns public URL. */
export async function uploadGalleryImage(
  file: File,
  folder = ""
): Promise<string> {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExt)
    ? fileExt
    : "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${safeExt}`;
  const filePath = folder ? `${folder.replace(/\/$/, "")}/${fileName}` : fileName;

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Storage upload failed");
  }

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Could not resolve public URL for uploaded image");
  }
  return data.publicUrl;
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

  try {
    const path = storagePathFromPublicUrl(imageUrl);
    if (path) {
      await supabase.storage.from(GALLERY_BUCKET).remove([path]);
    }
  } catch (e) {
    console.warn("Storage delete skipped:", e);
  }
}

/** Extract object path from Supabase public URL (handles nested paths like clients/abc.jpg). */
function storagePathFromPublicUrl(imageUrl: string): string | null {
  const marker = `/object/public/${GALLERY_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) {
    const parts = imageUrl.split("/");
    const last = parts[parts.length - 1]?.split("?")[0];
    return last || null;
  }
  return decodeURIComponent(imageUrl.slice(idx + marker.length).split("?")[0]);
}
