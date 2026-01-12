import type { OrderRecord, OrderRouting, OrderRoutingStage, OrderStatus } from "./types";

export type OrdersListFilters = {
  orgId: string;
  status?: OrderStatus;
  clientId?: string;
};

export type CreateOrderInput = Omit<
  OrderRecord,
  "id" | "createdAt" | "updatedAt" | "status" | "meta" | "priority"
> & {
  status?: OrderStatus;
  priority?: OrderRecord["priority"];
  meta?: OrderRecord["meta"];
};

export type UpdateOrderStatusInput = {
  orderId: string;
  status: OrderStatus;
};

export type CreateRoutingInput = {
  orderId: string;
  name?: string;
};

export type CreateRoutingStagesInput = {
  routingId: string;
  stages: Array<Omit<OrderRoutingStage, "id" | "createdAt" | "updatedAt">>;
};

export type OrdersRepository = {
  list: (filters: OrdersListFilters) => Promise<OrderRecord[]>;
  create: (input: CreateOrderInput) => Promise<OrderRecord>;
  updateStatus: (input: UpdateOrderStatusInput) => Promise<OrderRecord>;
  createRouting: (input: CreateRoutingInput) => Promise<OrderRouting>;
  createRoutingStages: (input: CreateRoutingStagesInput) => Promise<OrderRoutingStage[]>;
};

export function buildOrdersUseCases(repo: OrdersRepository) {
  return {
    listOrders: (filters: OrdersListFilters) => repo.list(filters),
    createOrder: (input: CreateOrderInput) => repo.create(input),
    updateOrderStatus: (input: UpdateOrderStatusInput) => repo.updateStatus(input),
    createRouting: (input: CreateRoutingInput) => repo.createRouting(input),
    createRoutingStages: (input: CreateRoutingStagesInput) => repo.createRoutingStages(input),
  };
}
