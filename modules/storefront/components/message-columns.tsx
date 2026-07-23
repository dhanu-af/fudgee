"use client";

import { useActionState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// No email-sending infrastructure exists in this app — this opens whatever
// email client is already configured on the admin's own machine (Gmail,
// Outlook, etc.) with the reply pre-addressed and quoting the original
// message, rather than trying to send mail server-side.
function buildReplyMailto(row: ContactMessageRow) {
  const subject = encodeURIComponent("Re: Your message to Fudgee");
  const body = encodeURIComponent(`Hi ${row.name},\n\n\n\n---\nYour original message:\n"${row.message}"`);
  return `mailto:${row.email}?subject=${subject}&body=${body}`;
}

function MessageDetailDialog({ row }: { row: ContactMessageRow }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<button type="button" className="max-w-md truncate text-left hover:underline" />}
      >
        {row.message}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{row.name}</DialogTitle>
          <DialogDescription>
            {row.email}
            {row.phone ? ` · ${row.phone}` : ""} · {new Date(row.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <p className="whitespace-pre-line text-sm">{row.message}</p>
        <DialogFooter showCloseButton>
          <Button render={<a href={buildReplyMailto(row)} />}>Reply via Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
    cell: ({ row }) => <MessageDetailDialog row={row.original} />,
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
