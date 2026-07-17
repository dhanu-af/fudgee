"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerFormState } from "@/modules/customers/actions";

type Customer = {
  id: string;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
  billingAddress: string | null;
  shippingAddress: string | null;
};

export function CustomerForm({
  action,
  customer,
}: {
  action: (prev: CustomerFormState, formData: FormData) => Promise<CustomerFormState>;
  customer?: Customer;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={customer?.name} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" defaultValue={customer?.code ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={customer?.phone ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="billingAddress">Billing address</Label>
        <Input id="billingAddress" name="billingAddress" defaultValue={customer?.billingAddress ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingAddress">Shipping address</Label>
        <Input id="shippingAddress" name="shippingAddress" defaultValue={customer?.shippingAddress ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/customers" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
