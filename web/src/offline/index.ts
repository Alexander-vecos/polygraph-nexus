export type OfflineQueueItem = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export interface OfflineQueueStore {
  enqueue: (item: OfflineQueueItem) => Promise<void>;
  list: () => Promise<OfflineQueueItem[]>;
  remove: (id: string) => Promise<void>;
}
