"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type DeleteActionState = { error?: string };

export function DeleteRowButton({
  action,
  confirmMessage = "Delete this? This cannot be undone.",
}: {
  action: (prev: DeleteActionState, formData: FormData) => Promise<DeleteActionState>;
  confirmMessage?: string;
}) {
  const [state, formAction, pending] = useActionState<DeleteActionState, FormData>(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
