export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export type TaskPriority = 0 | 1 | 2 | 3 | 4 | 5;

export interface TaskRecord {
  id: string;
  orgId: string;
  orderId?: string | null;
  stageId?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  dueAt?: string | null;
  labels: string[];
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskEvent {
  id: string;
  taskId: string;
  actorId?: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
