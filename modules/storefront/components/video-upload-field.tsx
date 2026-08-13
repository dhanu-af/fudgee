"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Film, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStorefrontVideo } from "@/modules/storefront/upload-actions";

// Same pattern as ImageUploadField — a pasteable text input paired with a
// real file upload button, either path setting the same `name` field value.
export function VideoUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
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
    const result = await uploadStorefrontVideo({}, formData);
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
          placeholder="Paste a video URL, or upload one"
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm font-medium whitespace-nowrap hover:bg-muted">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Film className="size-4" />}
          Upload
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {url && <video src={url} muted loop className="h-24 w-24 rounded-lg object-cover ring-1 ring-border/60" />}
      <p className="text-xs text-muted-foreground">
        MP4, WebM, or MOV, up to 25MB. Takes priority over the hero photos below when set — clear this field to go
        back to showing photos.
      </p>
    </div>
  );
}
