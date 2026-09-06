import type { Metadata } from "next";
import { getShopProducts } from "@/modules/storefront/queries";
import { BuildABoxFlow, type BoxProduct } from "@/components/storefront/build-a-box-flow";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Build Your Box",
  description: "Pick your box size, then mix and match any of our handcrafted fudge cookie flavours to fill it.",
  alternates: { canonical: `${SITE_URL}/build-a-box` },
};

// Catalog is admin-editable — same reasoning as /shop, always render fresh.
export const dynamic = "force-dynamic";

export default async function BuildABoxPage() {
  const products = await getShopProducts();

  // sellPrice is a Prisma Decimal — a class instance, not a plain object.
  // Passing it straight into BuildABoxFlow (a Client Component) would crash
  // RSC serialization the exact same way the /account Decimal bug did
  // earlier this session, so it's converted to a plain number here.
  const boxProducts: BoxProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl,
    price: p.sellPrice !== null ? Number(p.sellPrice) : null,
  }));

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">
          Build Your Box
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--sf-fg)]">
          Pick your pack. Fill it your way.
        </h1>
        <p className="max-w-md text-[var(--sf-muted)]">
          Choose a box size, then mix and match any of our handcrafted flavours to fill it.
        </p>
      </div>

      <BuildABoxFlow products={boxProducts} />
    </div>
  );
}
