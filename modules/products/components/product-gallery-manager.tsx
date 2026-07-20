"use client";

import { useActionState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/modules/storefront/components/image-upload-field";
import { addProductImage, deleteProductImage } from "@/modules/products/actions";

type ProductImage = { id: string; imageUrl: string };

function AddImageForm({ productId }: { productId: string }) {
  const [state, formAction, pending] = useActionState(addProductImage.bind(null, productId), {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2"
    >
      <ImageUploadField name="imageUrl" label="Add a gallery photo" />
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" variant="outline" disabled={pending} className="w-fit">
        {pending ? "Adding..." : "Add to gallery"}
      </Button>
    </form>
  );
}

function GalleryThumb({ image, productId }: { image: ProductImage; productId: string }) {
  const [, deleteAction, pending] = useActionState(deleteProductImage.bind(null, image.id, productId), {});

  return (
    <form action={deleteAction} className="group relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.imageUrl} alt="" className="size-20 rounded-lg object-cover ring-1 ring-border/60" />
      <button
        type="submit"
        disabled={pending}
        aria-label="Remove photo"
        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </form>
  );
}

export function ProductGalleryManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <GalleryThumb key={image.id} image={image} productId={productId} />
          ))}
        </div>
      )}
      <AddImageForm productId={productId} />
    </div>
  );
}
