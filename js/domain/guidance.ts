export type ProblemId = "missing" | "collection" | "verification" | "rejected" | "renewal" | "other";

export interface Guidance {
  readonly title: string;
  readonly intro: string;
  readonly steps: readonly string[];
  readonly source: string;
  readonly sourceUrl: string;
  readonly lastReviewed: string;
  readonly reviewer: string;
  readonly version: string;
}

export interface OfficialLink {
  readonly label: string;
  readonly href: string;
}

export const problemGuides: Readonly<Record<ProblemId, Guidance>> = Object.freeze({
  missing: {
    title: "Your ID has not arrived",
    intro: "You can start by checking the official status or asking NIRA for clarification.",
    steps: [
      "Keep any old registration reference, receipt or message safely.",
      "Use the official status-check channel before travelling to an office.",
      "If your application cannot be found, contact NIRA and explain when and where you registered."
    ],
    source: "NIRA official website",
    sourceUrl: "https://www.nira.go.ug/",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  },
  collection: {
    title: "Ready to collect your ID",
    intro: "Confirm the collection point and current requirements before you make the journey.",
    steps: [
      "Check the official collection instructions for your application.",
      "Carry your collection message, registration reference or other requested proof.",
      "Confirm opening times and whether the collection point has changed."
    ],
    source: "NIRA official website",
    sourceUrl: "https://www.nira.go.ug/",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  },
  verification: {
    title: "Your ID was not accepted",
    intro: "The problem may be with the service provider or with the identity record. Check both possibilities.",
    steps: [
      "Ask the provider what exactly failed and request the reason in writing.",
      "Do not share your personal number, one-time code or ID photo with strangers.",
      "If the record needs attention, use an official NIRA support channel."
    ],
    source: "NIRA contact and offices",
    sourceUrl: "https://www.nira.go.ug/contact-us",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  },
  rejected: {
    title: "Your application was rejected",
    intro: "Find out the stated reason before repeating a journey or submitting documents again.",
    steps: [
      "Keep the rejection message, receipt or reference and note the date.",
      "Check the official requirements for the specific service and correction needed.",
      "Ask NIRA which office or channel can clarify or challenge the decision."
    ],
    source: "NIRA official website",
    sourceUrl: "https://www.nira.go.ug/",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  },
  renewal: {
    title: "Renew, replace or correct your ID",
    intro: "The right process depends on whether your ID expired, was lost, damaged or needs a correction.",
    steps: [
      "Identify the reason for renewal, replacement or correction before starting.",
      "Prepare the original documents and references listed in the official instructions.",
      "Confirm the applicable fee and office with NIRA before you travel."
    ],
    source: "NIRA official website",
    sourceUrl: "https://www.nira.go.ug/",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  },
  other: {
    title: "Start with the official support channel",
    intro: "A clear record of what happened will help the right office understand your concern.",
    steps: [
      "Write down what you tried, when you tried it and what response you received.",
      "Keep references and receipts, but do not share sensitive credentials.",
      "Use NIRA’s official contact or feedback channel for case-specific help."
    ],
    source: "NIRA contact and offices",
    sourceUrl: "https://www.nira.go.ug/contact-us",
    lastReviewed: "30 October 2026",
    reviewer: "IDBridge content team",
    version: "1.0"
  }
});

export const checklistItems = Object.freeze([
  "Find your old reference or registration details",
  "Confirm the current official instructions",
  "Record when and where you followed up"
]);

export const officialLinks: readonly OfficialLink[] = Object.freeze([
  { label: "NIRA official website", href: "https://www.nira.go.ug/" },
  { label: "NIRA contact and offices", href: "https://www.nira.go.ug/contact-us" },
  { label: "NIRA appointment system", href: "https://servicebooking.nira.go.ug/" }
]);
