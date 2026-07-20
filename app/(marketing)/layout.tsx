import { Fredoka } from "next/font/google";
import { CartProvider } from "@/lib/storefront/cart-context";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { getStorefrontSettings } from "@/modules/storefront/queries";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStorefrontSettings();

  return (
    <div className={`storefront ${fredoka.variable} flex min-h-screen flex-col`}>
      <CartProvider>
        <StorefrontHeader />
        <main className="flex-1">{children}</main>
        <StorefrontFooter settings={settings} />
      </CartProvider>
    </div>
  );
}
