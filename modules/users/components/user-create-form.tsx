"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, type UserFormState } from "@/modules/users/actions";

type Role = { id: string; key: string; name: string };

export function UserCreateForm({ roles }: { roles: Role[] }) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(createUser, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="roleId">Role</Label>
        <Select name="roleId" defaultValue={roles[0]?.id}>
          <SelectTrigger id="roleId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="temporaryPassword">Temporary password</Label>
        <Input id="temporaryPassword" name="temporaryPassword" type="text" required minLength={8} />
        <p className="text-xs text-muted-foreground">
          The user must change this password the first time they sign in.
        </p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create user"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/users" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
