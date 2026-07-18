import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold">Fudgee</span>
        <Button render={<Link href="/login" />}>Sign In</Button>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-3xl font-semibold">Fudgee</h1>
        <p className="max-w-md text-muted-foreground">
          Manufacturing operations platform for food, pharmaceutical, and nutraceutical
          producers. Public site coming soon.
        </p>
        <Button render={<Link href="/login" />} className="mt-2">
          Sign In
        </Button>
      </div>
    </div>
  );
}
