"use client";

import { useActionState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markContactMessageRead, deleteContactMessage } from "@/modules/storefront/actions";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [, markReadAction, markPending] = useActionState(markContactMessageRead.bind(null, id), {});
  const [, deleteAction, deletePending] = useActionState(deleteContactMessage.bind(null, id), {});

  return (
    <div className="flex gap-2">
      {!isRead && (
        <form action={markReadAction}>
          <Button type="submit" variant="outline" size="sm" disabled={markPending}>
            Mark read
          </Button>
        </form>
      )}
      <form
        action={deleteAction}
        onSubmit={(e) => {
          if (!window.confirm("Delete this message? This cannot be undone.")) e.preventDefault();
        }}
      >
        <Button type="submit" variant="outline" size="sm" disabled={deletePending}>
          Delete
        </Button>
      </form>
    </div>
  );
}

export const messageColumns: ColumnDef<ContactMessageRow>[] = [
  {
    accessorKey: "name",
    header: "From",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div className="max-w-md truncate">{row.original.message}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isRead ? "secondary" : "default"}>
        {row.original.isRead ? "Read" : "New"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <MessageActions id={row.original.id} isRead={row.original.isRead} />,
  },
];
