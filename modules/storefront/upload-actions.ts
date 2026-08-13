"use server";

import { put } from "@vercel/blob";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export type UploadImageState = { url?: string; error?: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Called directly (not via a <form action>) from ImageUploadField, so an
// admin can upload a photo without submitting the whole surrounding form.
export async function uploadStorefrontImage(
  _prev: UploadImageState,
  formData: FormData
): Promise<UploadImageState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Please upload a JPEG, PNG, WEBP, or GIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be smaller than 5MB." };
  }

  try {
    const blob = await put(`storefront/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
    });
    return { url: blob.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Logged (not just swallowed) so the real cause shows up in Vercel's
    // runtime logs instead of only ever seeing a generic fallback message.
    console.error("uploadStorefrontImage failed:", message);
    return {
      error: `Upload failed: ${message}`,
    };
  }
}

// Same shape as uploadStorefrontImage above, for the hero video field —
// separate action (rather than branching on mime type in one function) so
// the two have independently tunable size limits and allowed types.
export async function uploadStorefrontVideo(
  _prev: UploadImageState,
  formData: FormData
): Promise<UploadImageState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a video to upload." };
  }
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { error: "Please upload an MP4, WebM, or MOV video." };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { error: "Video must be smaller than 25MB." };
  }

  try {
    const blob = await put(`storefront/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
    });
    return { url: blob.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("uploadStorefrontVideo failed:", message);
    return {
      error: `Upload failed: ${message}`,
    };
  }
}
