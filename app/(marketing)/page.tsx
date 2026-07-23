import type { Metadata } from "next";
import { getStorefrontHomepageData } from "@/modules/storefront/queries";
import { HeroSection } from "@/components/storefront/hero-section";
import { CategoriesSection } from "@/components/storefront/categories-section";
import { ProductGridSection } from "@/components/storefront/product-grid-section";
import { GallerySection } from "@/components/storefront/gallery-section";
import { ReviewsSection } from "@/components/storefront/reviews-section";
import { FaqSection } from "@/components/storefront/faq-section";
import { AboutSection } from "@/components/storefront/about-section";
import { ContactSection } from "@/components/storefront/contact-section";
import { SITE_URL } from "@/lib/site-config";

// Content here is admin-editable via the Storefront CMS, and this page's
// build-time static prerender was already racing DB migrations twice this
// session (a `next build` queries the live DB during "Generating static
// pages", so it fails if a just-added column hasn't been applied yet).
// Rendering per-request instead removes that class of bug entirely.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // No `title` here — inherits the (marketing) layout's `default` title,
  // which is this exact string. Any plain string set here would otherwise
  // get wrapped by the layout's "%s | Fudgee" template, duplicating the
  // brand name.
  description:
    "Small-batch, handcrafted fudge and confections made with real cream and real butter. Shop our full range and order online for delivery.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Fudgee — Handcrafted Fudge & Confections",
    description: "Small-batch, handcrafted fudge and confections made with real cream and real butter.",
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    title: "Fudgee — Handcrafted Fudge & Confections",
    description: "Small-batch, handcrafted fudge and confections made with real cream and real butter.",
  },
};

export default async function StorefrontHomePage() {
  const { settings, categories, featuredProducts, bestSellerProducts, galleryItems, reviews, faqItems } =
    await getStorefrontHomepageData();

  const shopableCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    products: c.products,
  }));

  return (
    <>
      <HeroSection
        heading={settings?.heroHeading ?? null}
        subheading={settings?.heroSubheading ?? null}
        imageUrl={settings?.heroImageUrl ?? null}
      />
      <CategoriesSection categories={shopableCategories} />
      <ProductGridSection
        id="featured"
        eyebrow="Featured"
        title="Featured Products"
        subtitle="A few of our favourites, picked fresh from the kitchen."
        products={featuredProducts}
      />
      <ProductGridSection
        id="best-sellers"
        eyebrow="Fan favourites"
        title="Best Sellers"
        subtitle="The flavours our customers keep coming back for."
        products={bestSellerProducts}
      />
      <GallerySection items={galleryItems} />
      <ReviewsSection reviews={reviews} />
      <AboutSection
        heading={settings?.aboutHeading ?? null}
        body={settings?.aboutBody ?? null}
        imageUrl={settings?.aboutImageUrl ?? null}
      />
      <FaqSection items={faqItems} />
      <ContactSection settings={settings} />
    </>
  );
}
