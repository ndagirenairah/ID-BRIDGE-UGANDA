import { problemGuides, type Guidance, type ProblemId } from "./guidance";

export abstract class GuidanceStrategy {
  abstract readonly problemId: ProblemId;
  abstract getGuidance(): Guidance;
}

abstract class ProblemGuidanceStrategy extends GuidanceStrategy {
  protected constructor(public readonly problemId: ProblemId) {
    super();
  }

  getGuidance(): Guidance {
    return problemGuides[this.problemId];
  }
}

export class MissingIdStrategy extends ProblemGuidanceStrategy {
  constructor() { super("missing"); }
}

export class CollectionStrategy extends ProblemGuidanceStrategy {
  constructor() { super("collection"); }
}

export class VerificationStrategy extends ProblemGuidanceStrategy {
  constructor() { super("verification"); }
}

export class RejectedApplicationStrategy extends ProblemGuidanceStrategy {
  constructor() { super("rejected"); }
}

export class RenewalStrategy extends ProblemGuidanceStrategy {
  constructor() { super("renewal"); }
}

export class OtherProblemStrategy extends ProblemGuidanceStrategy {
  constructor() { super("other"); }
}

export class GuidanceStrategyContext {
  private readonly strategies: ReadonlyMap<ProblemId, GuidanceStrategy>;

  constructor(strategies: readonly GuidanceStrategy[]) {
    this.strategies = new Map(strategies.map((strategy) => [strategy.problemId, strategy]));
  }

  getGuidance(problemId: string): Guidance | null {
    return this.strategies.get(problemId as ProblemId)?.getGuidance() ?? null;
  }
}
