"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { createPromoCode, updatePromoCode, deletePromoCode } from "@/modules/customers/actions";

type PromoCode = {
  id: string;
  code: string;
  discountPercent: number;
  expiresAt: Date | null;
  isActive: boolean;
};

function toDateInputValue(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function AddPromoCodeForm({ customerId }: { customerId: string }) {
  const [state, formAction, pending] = useActionState(createPromoCode.bind(null, customerId), {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-3 rounded-lg border border-border/60 p-3"
    >
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-code">Code</Label>
          <Input id="new-code" name="code" placeholder="e.g. DHANU20" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-discountPercent">Discount %</Label>
          <Input id="new-discountPercent" name="discountPercent" type="number" min={1} max={100} placeholder="e.g. 20" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-expiresAt">Expires (optional)</Label>
          <Input id="new-expiresAt" name="expiresAt" type="date" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked className="size-4" />
        Active
      </label>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" variant="outline" disabled={pending} className="w-fit">
        {pending ? "Adding..." : "Add promo code"}
      </Button>
    </form>
  );
}

function PromoCodeRow({ promoCode, customerId }: { promoCode: PromoCode; customerId: string }) {
  const [state, updateAction, updatePending] = useActionState(
    updatePromoCode.bind(null, promoCode.id, customerId),
    {}
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
      <form action={updateAction} className="grid grid-cols-3 gap-3">
        <input type="hidden" name="code" value={promoCode.code} />
        <div className="flex flex-col gap-1.5">
          <Label>Code</Label>
          <div className="flex h-9 items-center rounded-md border border-transparent px-1 font-mono text-sm font-semibold">
            {promoCode.code}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`discountPercent-${promoCode.id}`}>Discount %</Label>
          <Input
            id={`discountPercent-${promoCode.id}`}
            name="discountPercent"
            type="number"
            min={1}
            max={100}
            defaultValue={promoCode.discountPercent}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`expiresAt-${promoCode.id}`}>Expires</Label>
          <Input
            id={`expiresAt-${promoCode.id}`}
            name="expiresAt"
            type="date"
            defaultValue={toDateInputValue(promoCode.expiresAt)}
          />
        </div>
        <div className="col-span-3 flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={promoCode.isActive} className="size-4" />
            Active
          </label>
          <Button type="submit" size="sm" variant="outline" disabled={updatePending}>
            {updatePending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      <div className="flex justify-end">
        <DeleteRowButton
          action={deletePromoCode.bind(null, promoCode.id, customerId)}
          confirmMessage={`Delete code "${promoCode.code}"? This cannot be undone.`}
        />
      </div>
    </div>
  );
}

export function PromoCodeManager({ customerId, promoCodes }: { customerId: string; promoCodes: PromoCode[] }) {
  return (
    <div className="flex flex-col gap-3">
      {promoCodes.length > 0 && (
        <div className="flex flex-col gap-2">
          {promoCodes.map((promoCode) => (
            <PromoCodeRow key={promoCode.id} promoCode={promoCode} customerId={customerId} />
          ))}
        </div>
      )}
      <AddPromoCodeForm customerId={customerId} />
    </div>
  );
}
