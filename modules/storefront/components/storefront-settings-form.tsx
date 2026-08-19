"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/modules/storefront/components/image-upload-field";
import { VideoUploadField } from "@/modules/storefront/components/video-upload-field";
import { updateStorefrontSettings } from "@/modules/storefront/actions";

type StorefrontSettings = {
  heroHeading: string | null;
  heroSubheading: string | null;
  heroImageUrl: string | null;
  heroVideoUrl: string | null;
  aboutHeading: string | null;
  aboutBody: string | null;
  aboutImageUrl: string | null;
  aboutVideoUrl: string | null;
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
  googleReviewUrl: string | null;
  newsletterHeading: string | null;
  newsletterSubheading: string | null;
  legalBusinessName: string | null;
  abn: string | null;
  deliveryAreas: string | null;
  deliveryFee: string | null;
  freeDeliveryThreshold: string | null;
  dispatchTime: string | null;
  estimatedDeliveryTime: string | null;
  courierName: string | null;
  originAddress: string | null;
  originLat: unknown;
  originLng: unknown;
  payIdDetails: string | null;
  cashInstructions: string | null;
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
        <VideoUploadField name="heroVideoUrl" label="Hero video" defaultValue={settings?.heroVideoUrl} />
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
        <VideoUploadField name="aboutVideoUrl" label="About video" defaultValue={settings?.aboutVideoUrl} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Business details</h2>
        <p className="text-xs text-muted-foreground">
          Shown on the Refunds &amp; Returns, Shipping &amp; Delivery, and Complaints pages.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="legalBusinessName">Legal business name</Label>
          <Input
            id="legalBusinessName"
            name="legalBusinessName"
            placeholder="e.g. Fudgee Pty Ltd, or your own full name if a sole trader"
            defaultValue={settings?.legalBusinessName ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="abn">ABN</Label>
          <Input id="abn" name="abn" placeholder="XX XXX XXX XXX" defaultValue={settings?.abn ?? ""} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Shipping &amp; delivery</h2>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <Label htmlFor="originAddress">Delivery origin address</Label>
          <p className="text-xs text-muted-foreground">
            Where delivery distance is measured FROM (your kitchen/dispatch address) — this is what actually
            calculates each customer&apos;s delivery fee at checkout. Manage the fee amounts per distance and the
            free-delivery rule on the{" "}
            <a href="/storefront/delivery" className="underline">
              Delivery pricing
            </a>{" "}
            page.
          </p>
          <Input
            id="originAddress"
            name="originAddress"
            placeholder="e.g. 12 Example St, Southport QLD 4215"
            defaultValue={settings?.originAddress ?? ""}
          />
          {settings?.originAddress && (
            <p className={`text-xs ${settings.originLat != null ? "text-primary" : "text-destructive"}`}>
              {settings.originLat != null
                ? "✓ Location found — delivery fees calculate automatically."
                : "⚠ Couldn't locate this address — check the spelling/detail, then save again. Until this resolves, delivery fees will show as \"to be confirmed\" at checkout."}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          The fields below are free text shown on the Shipping &amp; Delivery page only — they don&apos;t affect the
          automatic fee calculation above. Leave any field blank to omit that line from the page.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deliveryAreas">Delivery areas</Label>
          <Textarea
            id="deliveryAreas"
            name="deliveryAreas"
            placeholder="e.g. Gold Coast and surrounding suburbs; Australia-wide by post"
            defaultValue={settings?.deliveryAreas ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deliveryFee">Delivery fee</Label>
          <Input id="deliveryFee" name="deliveryFee" placeholder="e.g. $9.95 flat rate" defaultValue={settings?.deliveryFee ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="freeDeliveryThreshold">Free-delivery condition</Label>
          <Input
            id="freeDeliveryThreshold"
            name="freeDeliveryThreshold"
            placeholder="e.g. Free delivery on orders over $50"
            defaultValue={settings?.freeDeliveryThreshold ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dispatchTime">Dispatch time</Label>
          <Input
            id="dispatchTime"
            name="dispatchTime"
            placeholder="e.g. Orders dispatch within 1–2 business days"
            defaultValue={settings?.dispatchTime ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="estimatedDeliveryTime">Estimated delivery time</Label>
          <Input
            id="estimatedDeliveryTime"
            name="estimatedDeliveryTime"
            placeholder="e.g. 2–5 business days after dispatch"
            defaultValue={settings?.estimatedDeliveryTime ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="courierName">Courier</Label>
          <Input
            id="courierName"
            name="courierName"
            placeholder="e.g. Australia Post"
            defaultValue={settings?.courierName ?? ""}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Alternative payment methods</h2>
        <p className="text-xs text-muted-foreground">
          Shown to a customer on their order-confirmation page when they choose Cash or PayID at checkout instead of
          paying by card. Leave blank and that payment option still works — the customer just won&apos;t see any
          extra instructions, so fill these in before relying on either option.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="payIdDetails">PayID details</Label>
          <Input
            id="payIdDetails"
            name="payIdDetails"
            placeholder="e.g. Send PayID payment to 0400 000 000 (Fudgee)"
            defaultValue={settings?.payIdDetails ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cashInstructions">Cash instructions</Label>
          <Input
            id="cashInstructions"
            name="cashInstructions"
            placeholder="e.g. Please have exact change ready on delivery"
            defaultValue={settings?.cashInstructions ?? ""}
          />
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
            Powers the &quot;Follow on Facebook&quot; card on the customer Account page (next to the WhatsApp
            Community card) — separate from the Facebook URL above (which is just the small footer icon). Leave
            blank to hide it.
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="googleReviewUrl">Google review link</Label>
          <Input
            id="googleReviewUrl"
            name="googleReviewUrl"
            placeholder="https://g.page/r/.../review"
            defaultValue={settings?.googleReviewUrl ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Powers the &quot;Leave a Google Review&quot; section at the bottom of the homepage. Leave blank to hide
            it.
          </p>
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
