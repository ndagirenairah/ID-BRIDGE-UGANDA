import type { Guidance } from "../domain/guidance";
import type { GuidanceStrategyContext } from "../domain/guidanceStrategies";

export interface ChecklistRepository {
  load(): boolean[];
  save(completedItems: readonly boolean[]): void;
}

export class GuidanceService {
  constructor(private readonly guidanceStrategyContext: GuidanceStrategyContext) {}

  getGuidance(problemId: string): Guidance | null {
    return this.guidanceStrategyContext.getGuidance(problemId);
  }
}

export class ChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  getCompletedItems(): boolean[] {
    return this.checklistRepository.load();
  }

  setCompletedItems(completedItems: readonly boolean[]): void {
    this.checklistRepository.save(completedItems);
  }
}
