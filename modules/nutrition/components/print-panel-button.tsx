"use client";

import { Button } from "@/components/ui/button";

export function PrintPanelButton() {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()}>
      Print Nutrition Panel
    </Button>
  );
}
