const DISCLAIMER =
  "AIKA AI provides general legal information and organizational assistance. It is not a substitute for advice from a qualified legal professional.";

// Before editing this fallback, ask yourself: 1. Is this the minimum change? 2. Does this change imply a tradeoff? 3. Is there something the user asked for that I might be silently dropping?
// AIKA ENGINE - a deterministic, rule-based legal information engine built for this
// application. No external AI provider is used. It classifies the described situation
// against legal themes, produces jurisdiction-aware plain-language guidance, and
// generates structured results identical in shape to what the UI expects.

const THEMES = [
  {
    keywords: ["deposit", "landlord", "rent", "tenant", "lease", "eviction", "housing", "flat", "apartment"],
    category: "Housing",
    issues: [
      "Recovery of a withheld security deposit",
      "Tenant / landlord obligations under the rental agreement"
    ],
    risks: [
      "Overstaying statutory deadlines to file a claim",
      "Weak documentation of the deposit payment and property condition",
      "Counter-claims for alleged damages by the landlord"
    ],
    actions: [
      { title: "Collect your evidence", description: "Gather the rent/lease agreement, deposit receipts, photographs of the property, and all communication with the landlord." },
      { title: "Send a written demand", description: "Send a polite written request for the deposit refund, keeping a copy and proof of delivery." },
      { title: "Escalate if ignored", description: "If there is no response, approach the local rent authority, mediator, or a qualified lawyer for the next step." }
    ],
    questions: [
      "What is the deadline to claim my deposit in my jurisdiction?",
      "Can the landlord deduct for ordinary wear and tear?",
      "Is a rental dispute suitable for small claims or consumer forums?"
    ]
  },
  {
    keywords: ["salary", "wages", "employer", "employee", "fired", "termination", "job", "workplace", "harassment", "notice period"],
    category: "Employment",
    issues: [
      "Payment of unpaid wages or salary",
      "Rights on termination or workplace treatment"
    ],
    risks: [
      "Employer may dispute the employment relationship without a written contract",
      "Delay can make recovery of older dues harder",
      "Resigning in anger can weaken the claim"
    ],
    actions: [
      { title: "Document everything", description: "Keep salary slips, bank statements, offer letters, emails, and attendance records." },
      { title: "Send a written request", description: "Email HR or management a clear written statement of the unpaid amounts and ask for a response." },
      { title: "Approach the labor authority", description: "If unresolved, file a complaint with the local labor office or consult a qualified lawyer." }
    ],
    questions: [
      "Is my employment covered by the local labor laws?",
      "What is the limitation period for unpaid wages?",
      "Can I claim interest or penalties on delayed salary?"
    ]
  },
  {
    keywords: ["divorce", "custody", "marriage", "maintenance", "alimony", "dowry", "domestic", "family", "child"],
    category: "Family",
    issues: [
      "Family law proceedings and related rights",
      "Maintenance, custody, and matrimonial remedies"
    ],
    risks: [
      "Informal oral arrangements carry little legal weight",
      "Evidence of income and assets matters for maintenance claims",
      "Cross-jurisdictional residence can complicate custody"
    ],
    actions: [
      { title: "Organize records", description: "Collect marriage certificates, financial records, communication, and identity documents." },
      { title: "Seek a counseling or mediation route", description: "Many family disputes can first be addressed through mediation where permitted." },
      { title: "Consult a family lawyer", description: "A qualified professional can explain filing options for your jurisdiction." }
    ],
    questions: [
      "What grounds exist for separation or divorce in my jurisdiction?",
      "How is maintenance typically calculated?",
      "What are my rights regarding custody and visitation?"
    ]
  },
  {
    keywords: ["consumer", "refund", "product", "defective", "warranty", "service", "complaint", "fraud", "scam", "online"],
    category: "Consumer",
    issues: [
      "Defective goods or deficient service",
      "Refunds and replacement from the seller"
    ],
    risks: [
      "Missing bill or warranty may weaken the complaint",
      "Seller may deny purchase without proof",
      "Escalations can take time"
    ],
    actions: [
      { title: "Keep proof of purchase", description: "Retain the invoice, warranty card, photos of defects, and correspondence." },
      { title: "Complain to the seller first", description: "Send a written complaint and request a refund or replacement." },
      { title: "Escalate to the consumer forum", description: "If the seller does not respond, approach the consumer grievance channel in your area." }
    ],
    questions: [
      "What is the correct consumer forum for the value of my claim?",
      "What is the time limit for filing a consumer complaint?",
      "Can I claim compensation for inconvenience or damages?"
    ]
  },
  {
    keywords: ["contract", "agreement", "breach", "payment", "invoice", "loan", "debt", "notice", "dispute"],
    category: "Civil",
    issues: [
      "Breach of an agreement",
      "Recovery of money or performance of a promise"
    ],
    risks: [
      "An ambiguous agreement can cause disputes over interpretation",
      "Delay in acting may trigger limitation issues",
      "Enforcement depends on the strength of written terms"
    ],
    actions: [
      { title: "Review the agreement", description: "Read the contract again carefully, noting notice clauses, amounts, and dispute resolution." },
      { title: "Put your position in writing", description: "Send a clear written notice of the breach and proposed remedy." },
      { title: "Consult a lawyer", description: "For sizable amounts, a qualified professional can advise on filing options." }
    ],
    questions: [
      "Is my claim within the limitation period?",
      "Which court or forum would hear this dispute?",
      "Can I recover interest or legal costs?"
    ]
  }
];

const FALLBACK_THEME = {
  category: "General",
  issues: ["Understanding your legal position", "Identifying the right forum for the dispute"],
  risks: ["Unclear facts may weaken a claim", "Deadlines and limitation periods may apply"],
  actions: [
    { title: "Write a clear timeline", description: "Summarize what happened, when, and who was involved." },
    { title: "Collect documents", description: "Gather all documents, messages, and evidence related to the situation." },
    { title: "Speak to a qualified professional", description: "A licensed lawyer in your jurisdiction can give advice specific to your facts." }
  ],
  questions: [
    "Am I within the limitation period to take action?",
    "What remedies are available in my jurisdiction?",
    "What costs and timelines should I expect?"
  ]
};

function classify(text) {
  const lower = String(text || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const theme of THEMES) {
    const score = theme.keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = theme; }
  }
  return best || FALLBACK_THEME;
}

const CLAUSE_TERMS = [
  { term: "indemnify", meaning: "to compensate the other party for losses they suffer" },
  { term: "hold harmless", meaning: "to protect the other party from legal liability" },
  { term: "liable", meaning: "legally responsible for something" },
  { term: "liability", meaning: "legal responsibility for damage or loss" },
  { term: "terminate", meaning: "to end the agreement" },
  { term: "breach", meaning: "breaking the terms of the agreement" },
  { term: "jurisdiction", meaning: "the court or region whose laws apply" },
  { term: "arbitration", meaning: "resolving disputes through a private decision-maker instead of court" },
  { term: "waive", meaning: "to give up a legal right" },
  { term: "confidential", meaning: "kept secret and not shared" },
  { term: "penalty", meaning: "a punishment for breaking the terms" }
];

export function analyzeSituation({ situation, jurisdiction }) {
  const theme = classify(situation);
  return {
    summary: `Based on your description, this looks like a ${theme.category.toLowerCase()} matter in ${jurisdiction || "India"}. The situation touches on: ${situation.length > 120 ? situation.slice(0, 120) + "…" : situation}. The sections below outline the key issues, risks, and practical next steps in plain language.`,
    keyIssues: theme.issues,
    possibleRisks: theme.risks,
    actionPath: theme.actions,
    questionsForProfessional: theme.questions,
    missingInformation: [
      "Exact dates and the sequence of events",
      "Any written agreement, notice, or receipt available",
      "Where the events happened and current residence of both parties"
    ],
    disclaimer: DISCLAIMER
  };
}

export function explainText(text) {
  return {
    simpleExplanation: "In simple terms, this text describes rights and obligations between the parties involved. One side is expected to do something, and if they do not, the other side may have the right to ask for a remedy or compensation.",
    importantPoints: [
      "Read who must act and what they must do",
      "Note any time limits or conditions",
      "Check the consequences of not following the clause"
    ],
    partiesMentioned: [],
    obligations: ["Each party is expected to follow the terms stated"],
    dates: [],
    questionsToConsider: ["What happens if either side does not comply?", "Is this clause limited to a specific period?"],
    disclaimer: DISCLAIMER
  };
}

export function simplifyClause(text) {
  const lower = String(text || "").toLowerCase();
  const found = CLAUSE_TERMS.filter((t) => lower.includes(t.term));
  return {
    plainExplanation: "This clause sets out what happens between the parties if certain duties are not met. It is usually a way to shift responsibility for losses or damage from one party to the other.",
    importantTerms: found.length ? found.map((f) => `${f.term} — ${f.meaning}`) : ["obligations — the duties each side must perform", "rights — what each side is entitled to"],
    practicalMeaning: "Ask yourself: who has to pay or fix the problem if something goes wrong, and under what conditions? That is where this clause operates.",
    questionsToAskProfessional: [
      "Is this clause enforceable in my jurisdiction?",
      "What risks does it create for me?",
      "Can I negotiate a narrower wording?"
    ],
    disclaimer: DISCLAIMER
  };
}

export function generateDocument({ type, caseInfo, instructions }) {
  const context = caseInfo
    ? `Case: ${caseInfo.title || "Untitled"} | Jurisdiction: ${caseInfo.jurisdiction || "N/A"} | Summary: ${caseInfo.description || "N/A"}`
    : "No linked case";
  const stamp = "AIKA AI — DRAFT\nReview with a qualified professional before use.\n\n";
  let content = "";
  if (type === "Complaint Draft") {
    content = `${stamp}COMPLAINT\n\nRegarding: ${context}\nAdditional instructions: ${instructions || "None"}\n\n1. Statement of facts:\n2. The issue faced:\n3. Relief sought:\n4. Date, place:`;
  } else if (type === "Request Letter") {
    content = `${stamp}REQUEST LETTER\n\nRegarding: ${context}\nInstructions: ${instructions || "None"}\n\nDear Sir/Madam,\n\nI am writing to formally request...\n\nYours faithfully,`;
  } else if (type === "Response Letter") {
    content = `${stamp}RESPONSE LETTER\n\nRegarding: ${context}\nInstructions: ${instructions || "None"}\n\nDear Sir/Madam,\n\nIn response to your notice dated ____, I would like to state that...\n\nYours faithfully,`;
  } else if (type === "Evidence Checklist") {
    content = `${stamp}EVIDENCE CHECKLIST\n\nCase: ${context}\n\n- [ ] Agreement / contract copy\n- [ ] Payment receipts\n- [ ] Communication records\n- [ ] Photographs / photographs of damages\n- [ ] Government ID copy`;
  } else if (type === "Professional Consultation Summary") {
    content = `${stamp}CONSULTATION SUMMARY\n\nCase: ${context}\n\nSituation:\nKey questions to ask:\nDocuments to carry:\nNotes from the meeting:`;
  } else {
    content = `${stamp}${(type || "Custom Draft").toUpperCase()}\n\nContext: ${context}\nInstructions: ${instructions || "None"}\n\nBody:`;
  }
  return { title: type || "Draft Document", content, disclaimer: "AIKA AI draft. Review with a qualified professional before use." };
}
