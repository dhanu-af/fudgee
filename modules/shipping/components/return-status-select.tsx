"use client";

import { useActionState, useRef } from "react";
import { updateReturnStatus, type ShippingFormState } from "@/modules/shipping/actions";

const STATUSES = ["REQUESTED", "INSPECTING", "APPROVED", "REJECTED", "REFUNDED", "REPLACED"];

export function ReturnStatusSelect({ id, status }: { id: string; status: string }) {
  const [state, formAction] = useActionState<ShippingFormState, FormData>(updateReturnStatus.bind(null, id), {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={formAction} ref={formRef}>
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
