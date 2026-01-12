import type { ChatMessage, ChatThread } from "./types";

export type CreateThreadInput = Omit<ChatThread, "id" | "createdAt">;

export type SendMessageInput = Omit<ChatMessage, "id" | "createdAt">;

export type ChatRepository = {
  listThreads: (orgId: string) => Promise<ChatThread[]>;
  createThread: (input: CreateThreadInput) => Promise<ChatThread>;
  listMessages: (threadId: string) => Promise<ChatMessage[]>;
  sendMessage: (input: SendMessageInput) => Promise<ChatMessage>;
};

export function buildChatUseCases(repo: ChatRepository) {
  return {
    listThreads: (orgId: string) => repo.listThreads(orgId),
    createThread: (input: CreateThreadInput) => repo.createThread(input),
    listMessages: (threadId: string) => repo.listMessages(threadId),
    sendMessage: (input: SendMessageInput) => repo.sendMessage(input),
  };
}
