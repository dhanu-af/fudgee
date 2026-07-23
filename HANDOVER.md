# Handover — 2026-07-24 14:30 UTC

## Goal

Continue building **Fudgee** (manufacturing ERP + public storefront) for
**Dhanu** — same non-technical, screenshot/plain-English, no-terminal
product owner as before (Claude still cannot log into the *admin* app, but
drives the public storefront directly for verification). This session: a
WhatsApp Cloud API notification system (order placed, order paid, contact
form), several storefront card features (WhatsApp Community, Facebook Fan
Page), a URL-sanitization bug fix, a large audit-trail request that got
scoped down then explicitly **deferred to next week**, and an auto-applied
promotion-discount-at-checkout feature that shipped with one real bug
(now fixed, but **not yet confirmed working by Dhanu** — see Next steps #1).

## State

Everything below is committed and pushed to `main` (HEAD `302f02b`, matches
`origin/main`), each deployed to Vercel and confirmed via Vercel
build/runtime logs. Vercel project `dkns1/fudgee`
(`prj_s6qXOR2pJsAbpPUHGE7TTyUGhToy`), team `team_IFsD28fF0XXuFVwrVhrnLXnX`.
**Repo is public on GitHub** (`dhanu-af/fudgee`) — never hardcode secrets or
personal phone numbers in source, env vars only.

1. **WhatsApp Cloud API notifications** — `lib/whatsapp.ts` (`sendWhatsAppMessage`,
   `notifyAdmins`). Uses a **brand-new, separate Meta WhatsApp app/credentials
   for Fudgee** — explicitly NOT shared with the Eagle Labs project's Meta app.
   Env vars: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
   `ADMIN_WHATSAPP_NUMBER` (now a **comma-separated list** — Dhanu has 2 numbers
   in it: `+61433517390,+61481114375`). `notifyAdmins(text)` sends to every
   number individually, keeps going if one fails, returns per-recipient
   results. Four call sites all go through it: a "Send Test Message" button
   on Storefront Settings (confirmed delivered by Dhanu), order-placed
   (`checkout-actions.ts`), order-paid (Stripe webhook), and contact-form
   submission (`public-actions.ts`). **Order-placed fires even though Stripe
   isn't configured yet** — once it is, both placed AND paid will fire per
   real order (flagged to Dhanu, not yet resolved — see Next steps #3).
2. **WhatsApp Community card + Facebook Fan Page card** — both on the
   customer Account page only (Facebook was originally built for 3 spots —
   homepage/footer/account — then narrowed to account-page-only per Dhanu's
   explicit request, since it was showing twice on the homepage itself via
   the footer). Both admin-editable via Storefront Settings
   (`whatsappCommunityUrl`, `facebookFanPageUrl` on `StorefrontSettings`),
   hide themselves when blank.
3. **URL sanitization fix** — Dhanu pasted WhatsApp's own share text
   ("Open this link to join my WhatsApp Group: https:/chat.whatsapp.com/...")
   into a link field; it saved verbatim and 404'd. New `optionalUrl()` in
   `modules/storefront/schema.ts` strips invisible/zero-width chars, extracts
   the real URL, fixes a stray single-slash-after-scheme, and validates —
   applied to all 5 link fields (WhatsApp Community, Instagram, Facebook,
   Facebook Fan Page, TikTok).
4. **Audit trail (Login History + Sales Order history + hide Super Admin) —
   DEFERRED, not implemented.** Dhanu asked for a full audit trail
   everywhere, narrowed it to just Login History + Sales Order history, then
   said "audit trail stop for now, I hope to add full audit trail next
   week." Extensive research already done (auth flow, Sales Order actions,
   RBAC) and saved to a plan file — see Next steps #4. **Also discovered: hiding
   the Super Admin account (her other explicit ask) appears to already be
   fully implemented** in `modules/users/queries.ts`/`actions.ts` and the
   `[id]` detail page — re-verify fresh before assuming this, but nothing
   was found missing.
5. **Auto-applied promotion discount at checkout** — `Promotion.discountPercent`
   (nullable 1–100), `SalesOrder.discountPercent`/`discountAmount`.
   `getBestActiveDiscount()` (in `modules/storefront/queries.ts`) picks the
   single highest-percent currently-active promotion (no stacking).
   `checkout-actions.ts` deducts it from the subtotal *before* GST is
   computed, and applies a fresh Stripe Coupon (`percent_off`,
   `duration: "once"`) to the Checkout Session rather than mutating line
   items (avoids per-line rounding drift). `SalesOrder.subtotal`/`total`
   keep meaning "post-discount" exactly as every existing Finance report
   already assumes — zero Finance code changed. Cart page, Sales Order
   detail page, and the printable invoice all show a matching Discount line.
   **Real bug found and fixed this session**: `createPromotion`/
   `updatePromotion` build their parsed input via explicit per-field
   `formData.get(...)` calls, not `Object.fromEntries(formData)` — adding
   `discountPercent` to the schema and the form did NOT wire it into these
   two actions, so it silently saved as `null` every time with no error.
   Fixed in `302f02b`. **Dhanu had not yet re-tested after this fix when the
   session ended** — she needs to re-open the promotion, re-enter Discount %
   (the earlier save before the fix didn't take), save, and try checkout
   again.

## Key decisions

- **Separate Meta WhatsApp app for Fudgee, not reused from Eagle Labs** —
  explicit instruction from Dhanu, verified nothing shared.
- **Order notifications fire at both placement and payment** (not just
  payment) *specifically because* Stripe isn't configured yet — a deliberate
  interim measure per Dhanu's request ("if you can create someone create a
  oder without payment receiveing message"), flagged as needing a decision
  once Stripe goes live (see Open questions).
- **Discount is a whole-order percentage on `Promotion`, not a separate
  coupon-code system** — matches the "20% OFF Storewide" marketing framing
  Dhanu already uses, no customer-facing code entry.
- **`SalesOrder.subtotal`/`total` redefined to always mean post-discount** —
  chosen specifically so zero existing Finance queries (P&L, GST Summary,
  Customer Profitability, Statement) needed to change; the pre-discount
  amount is always derivable as `subtotal + discountAmount`.
- **Stripe Coupon created fresh per checkout** rather than scaling down each
  line item's `unit_amount` — avoids reconciling per-line cent-rounding
  drift against our own `discountAmount` calculation.
- **Audit trail scope narrowed, then paused entirely** — Dhanu's own call,
  revisit next week rather than building anything now.

## Files touched

- **WhatsApp**: `lib/whatsapp.ts` (new), `modules/storefront/actions.ts`
  (`sendTestWhatsAppMessage`), `modules/storefront/components/whatsapp-test-button.tsx`
  (new), `app/(dashboard)/storefront/settings/page.tsx`,
  `modules/storefront/checkout-actions.ts`, `app/api/webhooks/stripe/route.ts`,
  `modules/storefront/public-actions.ts`.
- **Cards**: `modules/customer-account/components/whatsapp-community-card.tsx`,
  `components/storefront/facebook-fanpage-card.tsx` (new),
  `app/(marketing)/account/page.tsx`, `components/storefront/footer.tsx`
  (Facebook card added then removed), `app/(marketing)/page.tsx` (same).
- **URL fix**: `modules/storefront/schema.ts` (`optionalUrl`).
- **Promotion discount**: `prisma/schema.prisma` (`Promotion.discountPercent`,
  `SalesOrder.discountPercent`/`discountAmount`), `modules/storefront/schema.ts`
  (`optionalPercent`, `promotionSchema`), `modules/storefront/actions.ts`
  (`createPromotion`/`updatePromotion` — **the bug fix**), `modules/storefront/components/promotion-form.tsx`,
  `modules/storefront/queries.ts` (`getBestActiveDiscount`),
  `lib/storefront/gst.ts` (`applyDiscount`), `modules/storefront/checkout-actions.ts`,
  `app/(marketing)/cart/page.tsx`, `components/storefront/cart-view.tsx`,
  `app/(dashboard)/sales-orders/[id]/page.tsx`,
  `app/(dashboard)/sales-orders/[id]/invoice/page.tsx`.
- **Migrations this session** (all confirmed applied by Dhanu):
  `20260723160000_add_whatsapp_community_url`,
  `20260723170000_add_facebook_fanpage_url`,
  `20260724090000_add_promotion_discount` (+ matching
  `prisma/migration-bookkeeping-{20,21,22}.sql`).
- **Plan file** (research + design, not yet executed):
  `C:\Users\dnand\.claude\plans\rustling-whistling-liskov.md` — covers both
  the deferred audit-trail work and the (now-shipped) promotion-discount
  design in detail.

## Gotchas / constraints learned

- **This repo is public on GitHub** — confirmed via Vercel deployment
  metadata (`githubRepoVisibility: "public"`). Never hardcode phone numbers,
  tokens, or any secret in source; env vars only, and told Dhanu to add them
  in Vercel herself (never asked her to paste secret values into chat).
- **A Vercel redeploy while a page is already open in the browser** causes
  "Failed to find Server Action ... This request might be from an older or
  newer deployment" — a benign client-side exception, not a bug. Fix is a
  hard refresh, not a code change. Happened once this session right after
  Dhanu manually triggered a redeploy from the Vercel dashboard.
- **Server actions that build their validated object via explicit per-field
  `formData.get(...)` calls (not `Object.fromEntries(formData)`) are a real
  footgun** — adding a new field to the Zod schema *and* the form UI does
  NOT automatically wire it into the action. This exact mistake shipped once
  this session (`Promotion.discountPercent` silently always saved `null`,
  with the POST returning success/no error the whole time). Any future
  schema+form field addition to `createPromotion`/`updatePromotion` or
  similar explicit-field actions needs the new key added to the action's
  `formData.get(...)` object too — grep for the action first.
- **`STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` still not set** — confirmed
  again this session via a real checkout attempt that failed at Stripe
  session creation. Dhanu said she's creating a **new Stripe account** —
  unclear if this is her own account or a client/business owner's (see Open
  questions #1). Until it's live, no storefront order can ever reach PAID.
- **Migration-bookkeeping checksums verified programmatically every time**
  (`sha256sum` + diff, never eyeballed) — carried-forward gotcha from a
  prior session, followed for all 3 migrations this session.
- **Local dev DB still broken** (`VERCEL_OIDC_TOKEN` expired) — all schema/
  logic verification this session done by running the actual compiled
  `schema.ts`/`gst.ts` files directly via `npx tsx` against real and edge-case
  inputs, not via `next dev`.
- Always send migration SQL in the same message as the push — Dhanu applies
  it manually in Neon, and pages touching the changed table break until she
  does. Followed correctly all 3 times this session.

## Next steps

1. **Confirm the promotion discount actually works now.** Dhanu needs to
   re-open her promotion in Storefront > Promotions, re-enter Discount %
   (the pre-fix save didn't take), save, then try checkout again. A fresh
   session should ask her directly, or check Vercel runtime logs for a
   discounted checkout going through cleanly.
2. **Stripe still needs real API keys.** `STRIPE_SECRET_KEY` +
   `STRIPE_WEBHOOK_SECRET` (pointing `https://fudgee.au/api/webhooks/stripe`
   at `checkout.session.completed`) — Dhanu is in the process of creating a
   new Stripe account for this.
3. **Once Stripe is live**, decide with Dhanu whether to keep both the
   order-placed and order-paid WhatsApp notifications (two messages per real
   sale) or drop the "placed" one now that "paid" will actually fire.
4. **Audit trail — resume only when Dhanu explicitly re-confirms scope next
   week.** Full research already done for Login History (auth flow, hook
   points) and Sales Order history (actions, payment-status write sites) —
   read the plan file above before redoing that research; it also flags that
   the "no refund action exists yet" gap (only `REFUNDED` as a dangling enum
   value) would need resolving if she still wants refund tracking.
5. Test-data cleanup carried over from an earlier session — never confirmed
   done: `claude-account-test@example.com`, old Stripe test customers, the
   GIHAN AMILA KASUN / SO-0019 / INV-0001 chain.
6. Dhanu asked to delete a set of seed staff User accounts
   (`management@fudgee.test`, `finance@fudgee.test`, etc.) — explained the
   built-in self-delete safeguard and pointed her to Operations > Users to
   do it herself (Claude can't log into admin). Not confirmed done.
7. Dhanu asked for a customer-facing PDF explaining "this module" (offered
   Promotion Discount, WhatsApp notifications, or both) then said "no need
   now" — re-offer if she brings it up again.

## Open questions

1. Who is "the website owner" Dhanu is creating a new Stripe account for —
   is she operating Fudgee on behalf of a separate client/business owner
   rather than owning it herself? Not clarified; could matter for future
   scoping decisions.
2. Whether to keep both WhatsApp order notifications (placed + paid) once
   Stripe is live, or drop one.
3. Audit trail's exact scope next week — Login History + Sales Order
   history was the last-narrowed version, but Dhanu may re-scope again.
4. Carried over, still unresolved: whether the Bronze/Silver/Gold rewards
   tier thresholds (100/300 points) are right or just a placeholder.
