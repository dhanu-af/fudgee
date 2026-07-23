"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/modules/storefront/components/image-upload-field";
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
  openingHours: string | null;
  whatsappNumber: string | null;
  whatsappCommunityUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  facebookFanPageUrl: string | null;
  tiktokUrl: string | null;
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
        <ImageUploadField name="heroImageUrl" label="Hero image" defaultValue={settings?.heroImageUrl} />
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
        <ImageUploadField name="aboutImageUrl" label="About image" defaultValue={settings?.aboutImageUrl} />
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="openingHours">Opening hours</Label>
          <Textarea
            id="openingHours"
            name="openingHours"
            placeholder={"Mon–Fri: 9am – 5pm\nSat: 10am – 2pm\nSun: Closed"}
            defaultValue={settings?.openingHours ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsappNumber">WhatsApp number</Label>
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            placeholder="+61 4XX XXX XXX"
            defaultValue={settings?.whatsappNumber ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsappCommunityUrl">WhatsApp Community invite link</Label>
          <Input
            id="whatsappCommunityUrl"
            name="whatsappCommunityUrl"
            placeholder="https://chat.whatsapp.com/..."
            defaultValue={settings?.whatsappCommunityUrl ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Powers the &quot;Join WhatsApp Community&quot; card on the customer Account page. Leave blank to hide it.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Social media</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            name="instagramUrl"
            placeholder="https://instagram.com/yourhandle"
            defaultValue={settings?.instagramUrl ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            name="facebookUrl"
            placeholder="https://facebook.com/yourpage"
            defaultValue={settings?.facebookUrl ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="facebookFanPageUrl">Facebook Fan Page URL</Label>
          <Input
            id="facebookFanPageUrl"
            name="facebookFanPageUrl"
            placeholder="https://facebook.com/yourpage"
            defaultValue={settings?.facebookFanPageUrl ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Powers the &quot;Follow on Facebook&quot; card on the homepage, footer, and customer Account page —
            separate from the Facebook URL above (which is just the small footer icon). Leave blank to hide it.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tiktokUrl">TikTok URL</Label>
          <Input
            id="tiktokUrl"
            name="tiktokUrl"
            placeholder="https://tiktok.com/@yourhandle"
            defaultValue={settings?.tiktokUrl ?? ""}
          />
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
