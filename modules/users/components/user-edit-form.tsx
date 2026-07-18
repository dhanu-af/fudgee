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
import type { UserFormState } from "@/modules/users/actions";

type Role = { id: string; key: string; name: string };
type UserWithRole = { id: string; name: string; email: string; isActive: boolean; roleId: string };

export function UserEditForm({
  action,
  user,
  roles,
}: {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
  user: UserWithRole;
  roles: Role[];
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={user.name} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input value={user.email} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="roleId">Role</Label>
        <Select
          name="roleId"
          defaultValue={user.roleId}
          items={Object.fromEntries(roles.map((r) => [r.id, r.name]))}
        >
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
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={user.isActive} className="size-4" />
        Active
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/users" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
