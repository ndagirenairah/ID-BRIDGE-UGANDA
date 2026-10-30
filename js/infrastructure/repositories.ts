import type { ChecklistRepository } from "../application/useCases";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class LocalStorageChecklistRepository implements ChecklistRepository {
  constructor(private readonly storage: StorageLike, private readonly key: string) {}

  load(): boolean[] {
    try {
      const saved: unknown = JSON.parse(this.storage.getItem(this.key) || "[]");
      return Array.isArray(saved) ? saved.map(Boolean) : [];
    } catch (error) {
      console.warn("IDBridge checklist data could not be read; starting a new checklist.", error);
      return [];
    }
  }

  save(completedItems: readonly boolean[]): void {
    this.storage.setItem(this.key, JSON.stringify(completedItems.map(Boolean)));
  }
}
