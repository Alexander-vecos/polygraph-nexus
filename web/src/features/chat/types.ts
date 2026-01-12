export interface ChatThread {
  id: string;
  orgId: string;
  orderId?: string | null;
  taskId?: string | null;
  title?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  authorId?: string | null;
  body: string;
  attachments: Array<Record<string, unknown>>;
  createdAt: string;
}
