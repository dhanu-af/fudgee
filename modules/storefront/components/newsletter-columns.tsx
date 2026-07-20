"use client";

import { useActionState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { deleteNewsletterSignup } from "@/modules/storefront/actions";

export type NewsletterSignupRow = {
  id: string;
  email: string;
  createdAt: Date;
};

function NewsletterActions({ id }: { id: string }) {
  const [, deleteAction, pending] = useActionState(deleteNewsletterSignup.bind(null, id), {});

  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!window.confirm("Remove this signup? This cannot be undone.")) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        Remove
      </Button>
    </form>
  );
}

export const newsletterColumns: ColumnDef<NewsletterSignupRow>[] = [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "createdAt",
    header: "Signed up",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <NewsletterActions id={row.original.id} />,
  },
];
