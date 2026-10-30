import { checklistItems, officialLinks } from "./js/domain/guidance";
import { ChecklistService, GuidanceService } from "./js/application/useCases";
import { LocalStorageChecklistRepository } from "./js/infrastructure/repositories";
import { AssistantController } from "./js/presentation/assistantController";
import {
  CollectionStrategy,
  GuidanceStrategyContext,
  MissingIdStrategy,
  OtherProblemStrategy,
  RejectedApplicationStrategy,
  RenewalStrategy,
  VerificationStrategy
} from "./js/domain/guidanceStrategies";

const translations = {
  en: {
    nav: ["Find help", "Knowledge centre", "My next steps"],
    heroTitle: "Your next step<br /><em>made clear.</em>",
    heroLede: "Simple, trusted help with National ID applications, renewals, collection and checking your ID in Uganda.",
    heroButton: "Find guidance <span aria-hidden=\"true\">→</span>",
    assistantTitle: "What problem are you facing?",
    assistantIntro: "Choose an option to see how IDBridge can guide you. This is guidance, not a live NIRA status check."
  },
  lg: {
    nav: ["Noonya obuyambi", "Amagezi", "Emitendera gyange"],
    heroTitle: "Omutendera gwo<br /><em>gutegeerekeka.</em>",
    heroLede: "Obuyambi obwangu era obwesigika ku kusaba, okuzza obuggya, okukima n’okukebera National ID mu Uganda.",
    heroButton: "Noonya amagezi <span aria-hidden=\"true\">→</span>",
    assistantTitle: "Kizibu ki ky’oyolekedde?",
    assistantIntro: "Londa eky’okulonda okumanya engeri IDBridge gy’eyinza okukuyambamu."
  },
  sw: {
    nav: ["Pata msaada", "Kituo cha maarifa", "Hatua zangu"],
    heroTitle: "Hatua yako<br /><em>iwe wazi.</em>",
    heroLede: "Msaada rahisi na wa kuaminika kuhusu maombi, upya, kuchukua na kuangalia National ID nchini Uganda.",
    heroButton: "Pata mwongozo <span aria-hidden=\"true\">→</span>",
    assistantTitle: "Unakabiliwa na tatizo gani?",
    assistantIntro: "Chagua tatizo ili kuona jinsi IDBridge inaweza kukuongoza."
  }
} as const;

const required = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required page element: ${selector}`);
  return element;
};

const guidanceStrategies = [
  new MissingIdStrategy(),
  new CollectionStrategy(),
  new VerificationStrategy(),
  new RejectedApplicationStrategy(),
  new RenewalStrategy(),
  new OtherProblemStrategy()
];
const guidanceService = new GuidanceService(new GuidanceStrategyContext(guidanceStrategies));
const checklistService = new ChecklistService(
  new LocalStorageChecklistRepository(window.localStorage, "idbridge-checklist")
);

const checklistItemsContainer = required<HTMLDivElement>("#checklist-items");
checklistItemsContainer.innerHTML = checklistItems.map((item) => `
  <label class="check-item"><input type="checkbox" /><span>${item}</span></label>
`).join("");

const threatChecks = [...document.querySelectorAll<HTMLInputElement>(".security-card input")];
let savedThreatChecks: unknown = [];
try {
  savedThreatChecks = JSON.parse(window.localStorage.getItem("idbridge-threat-model") || "[]");
} catch (error) {
  console.warn("IDBridge threat-model data could not be read; starting a new assessment.", error);
}
const savedThreats = Array.isArray(savedThreatChecks) ? savedThreatChecks : [];
threatChecks.forEach((checkbox, index) => {
  checkbox.checked = savedThreats[index] === true;
  checkbox.addEventListener("change", () => {
    window.localStorage.setItem("idbridge-threat-model", JSON.stringify(threatChecks.map((item) => item.checked)));
  });
});

new AssistantController({
  service: guidanceService,
  panel: required<HTMLElement>("#assistant-panel"),
  cards: document.querySelectorAll<HTMLButtonElement>(".problem-card")
}).bind();

const checkboxes = [...checklistItemsContainer.querySelectorAll<HTMLInputElement>("input")];
const checklist = required<HTMLElement>("#checklist");
const count = required<HTMLElement>("#checklist-count");
const emptyMessage = required<HTMLElement>("#checklist-empty");

const updateChecklistCount = (): void => {
  count.textContent = `${checkboxes.filter((checkbox) => checkbox.checked).length} / ${checkboxes.length} done`;
  emptyMessage.hidden = true;
};

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checklistService.setCompletedItems(checkboxes.map((item) => item.checked));
    updateChecklistCount();
  });
});
checklistService.getCompletedItems().forEach((completed, index) => {
  if (checkboxes[index]) checkboxes[index].checked = completed;
});
updateChecklistCount();

document.querySelector<HTMLButtonElement>("#add-checklist")?.addEventListener("click", () => {
  checklist.scrollIntoView({ behavior: "smooth", block: "center" });
  checkboxes[0]?.focus();
});

document.querySelector<HTMLSelectElement>("#language-select")?.addEventListener("change", (event) => {
  const language = (event.target as HTMLSelectElement).value as keyof typeof translations;
  const copy = translations[language] || translations.en;
  document.documentElement.lang = language;
  document.querySelectorAll(".main-nav a").forEach((link, index) => { link.textContent = copy.nav[index]; });
  required<HTMLHeadingElement>("h1").innerHTML = copy.heroTitle;
  required<HTMLElement>(".hero-lede").textContent = copy.heroLede;
  required<HTMLAnchorElement>(".hero-actions .button").innerHTML = copy.heroButton;
  required<HTMLHeadingElement>("#assistant h2").textContent = copy.assistantTitle;
  required<HTMLElement>("#assistant .section-heading > p").textContent = copy.assistantIntro;
});

document.querySelectorAll<HTMLAnchorElement>("[data-official-link]").forEach((link) => {
  const officialLink = officialLinks.find((item) => item.label === link.dataset.officialLink);
  if (officialLink) link.href = officialLink.href;
});
