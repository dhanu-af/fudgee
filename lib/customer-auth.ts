import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// A completely separate session mechanism for storefront customer accounts —
// deliberately not sharing anything with lib/auth.ts (staff NextAuth,
// User/Role/Permission). DB-backed via CustomerSession rather than a signed
// JWT, so signing out is a real row delete, not just clearing a cookie.

const COOKIE_NAME = "customer_session";
const SESSION_DAYS = 30;

export async function createCustomerSession(customerId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.customerSession.create({ data: { customerId, token, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.customerSession.findUnique({ where: { token }, include: { customer: true } });
  if (!session || session.expiresAt < new Date() || !session.customer.isActive) return null;

  return session.customer;
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await db.customerSession.deleteMany({ where: { token } });
  }
  cookieStore.delete(COOKIE_NAME);
}

// Called at the top of every /account/** page except signup/login.
export async function requireCustomer() {
  const customer = await getCustomerSession();
  if (!customer) redirect("/account/login");
  return customer;
}
