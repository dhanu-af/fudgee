import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">Not authorized</h1>
      <p className="text-muted-foreground">
        Your role doesn&apos;t have access to this page.
      </p>
    </div>
  );
}
