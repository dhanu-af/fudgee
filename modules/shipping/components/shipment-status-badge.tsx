import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  WAITING: "secondary",
  PICKING: "secondary",
  PACKING: "secondary",
  PACKED: "outline",
  READY_TO_DISPATCH: "outline",
  DISPATCHED: "default",
  IN_TRANSIT: "default",
  OUT_FOR_DELIVERY: "default",
  DELIVERED: "default",
  RETURNED: "destructive",
  CANCELLED: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
  WAITING: "Waiting",
  PICKING: "Picking",
  PACKING: "Packing",
  PACKED: "Packed",
  READY_TO_DISPATCH: "Ready to Dispatch",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export function ShipmentStatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>{STATUS_LABEL[status] ?? status}</Badge>;
}
