import type { TaskEvent, TaskRecord, TaskStatus } from "./types";

export type TasksListFilters = {
  orgId: string;
  status?: TaskStatus;
  assigneeId?: string;
};

export type CreateTaskInput = Omit<TaskRecord, "id" | "createdAt" | "updatedAt">;

export type UpdateTaskStatusInput = {
  taskId: string;
  status: TaskStatus;
};

export type RecordTaskEventInput = Omit<TaskEvent, "id" | "createdAt">;

export type TasksRepository = {
  list: (filters: TasksListFilters) => Promise<TaskRecord[]>;
  create: (input: CreateTaskInput) => Promise<TaskRecord>;
  updateStatus: (input: UpdateTaskStatusInput) => Promise<TaskRecord>;
  recordEvent: (input: RecordTaskEventInput) => Promise<TaskEvent>;
};

export function buildTasksUseCases(repo: TasksRepository) {
  return {
    listTasks: (filters: TasksListFilters) => repo.list(filters),
    createTask: (input: CreateTaskInput) => repo.create(input),
    updateTaskStatus: (input: UpdateTaskStatusInput) => repo.updateStatus(input),
    recordTaskEvent: (input: RecordTaskEventInput) => repo.recordEvent(input),
  };
}
