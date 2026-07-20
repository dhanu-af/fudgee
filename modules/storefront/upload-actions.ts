"use server";

import { put } from "@vercel/blob";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export type UploadImageState = { url?: string; error?: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
  } catch {
    return {
      error: "Upload failed — Blob storage may not be set up for this project yet. Paste an image URL instead for now.",
    };
  }
}
