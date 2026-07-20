"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateStorefrontSettings } from "@/modules/storefront/actions";

type StorefrontSettings = {
  heroHeading: string | null;
  heroSubheading: string | null;
  heroImageUrl: string | null;
  aboutHeading: string | null;
  aboutBody: string | null;
  aboutImageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  newsletterHeading: string | null;
  newsletterSubheading: string | null;
} | null;

export function StorefrontSettingsForm({ settings }: { settings: StorefrontSettings }) {
  const [state, formAction, pending] = useActionState(updateStorefrontSettings, {});

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Hero section</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroHeading">Heading</Label>
          <Input id="heroHeading" name="heroHeading" placeholder="Handcrafted fudge, made with love" defaultValue={settings?.heroHeading ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroSubheading">Subheading</Label>
          <Textarea id="heroSubheading" name="heroSubheading" defaultValue={settings?.heroSubheading ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroImageUrl">Hero image URL</Label>
          <Input id="heroImageUrl" name="heroImageUrl" defaultValue={settings?.heroImageUrl ?? ""} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">About section</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutHeading">Heading</Label>
          <Input id="aboutHeading" name="aboutHeading" defaultValue={settings?.aboutHeading ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutBody">Body</Label>
          <Textarea id="aboutBody" name="aboutBody" rows={5} defaultValue={settings?.aboutBody ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutImageUrl">About image URL</Label>
          <Input id="aboutImageUrl" name="aboutImageUrl" defaultValue={settings?.aboutImageUrl ?? ""} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Contact details</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactPhone">Phone</Label>
          <Input id="contactPhone" name="contactPhone" defaultValue={settings?.contactPhone ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactAddress">Address</Label>
          <Textarea id="contactAddress" name="contactAddress" defaultValue={settings?.contactAddress ?? ""} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Newsletter section</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="newsletterHeading">Heading</Label>
          <Input id="newsletterHeading" name="newsletterHeading" defaultValue={settings?.newsletterHeading ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="newsletterSubheading">Subheading</Label>
          <Textarea id="newsletterSubheading" name="newsletterSubheading" defaultValue={settings?.newsletterSubheading ?? ""} />
        </div>
      </section>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Saved.</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
