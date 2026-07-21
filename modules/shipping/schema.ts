import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? undefined : v));

export const createShipmentSchema = z.object({
  salesOrderId: z.string().min(1, "Sales order is required"),
});
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

export const packageItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive(),
});

export const packageSchema = z.object({
  shipmentId: z.string().min(1),
  boxType: optionalText(100),
  weight: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  lengthCm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  widthCm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  heightCm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  photoUrl: optionalText(2000),
  itemsJson: z.string().min(1, "At least one item is required"),
});
export type PackageInput = z.infer<typeof packageSchema>;

export const dispatchSchema = z.object({
  carrierId: optionalText(64),
  trackingNumber: optionalText(200),
  freightCost: z.coerce.number().nonnegative().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  driverName: optionalText(200),
  vehicleInfo: optionalText(200),
  numberOfCartons: z.coerce.number().int().positive().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  signedBy: optionalText(200),
  dispatchNotes: optionalText(2000),
});
export type DispatchInput = z.infer<typeof dispatchSchema>;

export const trackingEventSchema = z.object({
  status: z.string().min(1, "Status is required").max(100),
  location: optionalText(200),
  note: optionalText(1000),
});
export type TrackingEventInput = z.infer<typeof trackingEventSchema>;

export const carrierSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  contactPhone: optionalText(50),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  isActive: z.coerce.boolean(),
  notes: optionalText(1000),
});
export type CarrierInput = z.infer<typeof carrierSchema>;

export const returnSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  shipmentId: optionalText(64),
  reason: z.string().min(1, "Reason is required").max(1000),
  quantity: z.coerce.number().positive(),
  inspectionNotes: optionalText(2000),
  refundAmount: z.coerce.number().nonnegative().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
});
export type ReturnInput = z.infer<typeof returnSchema>;

export const returnStatusSchema = z.object({
  status: z.enum(["REQUESTED", "INSPECTING", "APPROVED", "REJECTED", "REFUNDED", "REPLACED"]),
});
