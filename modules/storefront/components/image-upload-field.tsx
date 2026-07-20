"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStorefrontImage } from "@/modules/storefront/upload-actions";

// A text input (still pasteable/editable directly) paired with a real file
// upload button — either path just ends up setting the same `name` field
// value, so no changes are needed to the surrounding form's submit handling.
export function ImageUploadField({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadStorefrontImage({}, formData);
    setUploading(false);

    if (result.error) setError(result.error);
    else if (result.url) setUrl(result.url);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${name}-url`}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={`${name}-url`}
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste an image URL, or upload one"
          required={required}
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm font-medium whitespace-nowrap hover:bg-muted">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Upload
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover ring-1 ring-border/60" />
      )}
    </div>
  );
}
