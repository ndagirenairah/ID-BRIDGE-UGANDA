import type { GuidanceService } from "../application/useCases";

interface AssistantElements {
  service: GuidanceService;
  panel: HTMLElement;
  cards: NodeListOf<HTMLButtonElement>;
}

export class AssistantController {
  constructor(private readonly elements: AssistantElements) {}

  bind(): void {
    this.elements.cards.forEach((card) => {
      card.addEventListener("click", () => this.select(card.dataset.problem ?? ""));
    });
  }

  select(problemId: string): void {
    const guide = this.elements.service.getGuidance(problemId);
    if (!guide) return;

    this.elements.cards.forEach((card) => {
      card.classList.toggle("selected", card.dataset.problem === problemId);
    });
    this.elements.panel.innerHTML = `
      <span class="panel-number">02</span>
      <p class="eyebrow" style="color:#a7d2c8">Your starting point</p>
      <h3>${guide.title}</h3>
      <p>${guide.intro}</p>
      <ul>${guide.steps.map((step) => `<li>${step}</li>`).join("")}</ul>
      <p class="guide-source">Source: <a href="${guide.sourceUrl}" target="_blank" rel="noopener">${guide.source}</a><br />Checked: ${guide.lastReviewed} · Version ${guide.version}</p>
      <a class="button panel-action" href="#next-steps">Add to my next steps <span aria-hidden="true">→</span></a>
    `;
  }
}
