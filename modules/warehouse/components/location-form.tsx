"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocationFormState } from "@/modules/warehouse/actions";

type Location = {
  id: string;
  name: string;
  code: string | null;
};

export function LocationForm({
  action,
  location,
}: {
  action: (prev: LocationFormState, formData: FormData) => Promise<LocationFormState>;
  location?: Location;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={location?.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" defaultValue={location?.code ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/warehouse" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
