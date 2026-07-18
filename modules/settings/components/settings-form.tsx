"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganization, type SettingsFormState } from "@/modules/settings/actions";

type Organization = {
  name: string;
  timezone: string;
  currency: string;
  address: string | null;
};

export function SettingsForm({ organization }: { organization: Organization }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateOrganization, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" name="name" required defaultValue={organization.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" name="timezone" required defaultValue={organization.timezone} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" required defaultValue={organization.currency} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={organization.address ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Saved.</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
