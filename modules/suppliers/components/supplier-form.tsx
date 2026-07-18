"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SupplierFormState } from "@/modules/suppliers/actions";

type Supplier = {
  id: string;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export function SupplierForm({
  action,
  supplier,
}: {
  action: (prev: SupplierFormState, formData: FormData) => Promise<SupplierFormState>;
  supplier?: Supplier;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={supplier?.name} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" defaultValue={supplier?.code ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={supplier?.email ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={supplier?.phone ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={supplier?.address ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/purchase-orders/suppliers" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
