export type OrderStatus =
  | "draft"
  | "confirmed"
  | "in_production"
  | "qc"
  | "packed"
  | "shipped"
  | "closed"
  | "canceled"
  | "rework";

export type OrderRoutingStageStatus = "todo" | "in_progress" | "blocked" | "done" | "skipped";

export type OrderRoutingStageType = "print" | "cut" | "assemble" | "qc" | "ship" | "custom";

export type OrderPriority = 0 | 1 | 2 | 3 | 4 | 5;

export interface OrderRecord {
  id: string;
  orgId: string;
  clientId?: string | null;
  accountingNumber?: string | null;
  title: string;
  description?: string | null;
  priority: OrderPriority;
  status: OrderStatus;
  deadlineAt?: string | null;
  createdBy?: string | null;
  managerId?: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRouting {
  id: string;
  orderId: string;
  name: string;
  createdAt: string;
}

export interface OrderRoutingStage {
  id: string;
  routingId: string;
  seq: number;
  sectorId?: string | null;
  stageType: OrderRoutingStageType;
  title: string;
  status: OrderRoutingStageStatus;
  startedAt?: string | null;
  finishedAt?: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
