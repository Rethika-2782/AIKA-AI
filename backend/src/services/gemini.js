export async function analyzeSituation({ situation, jurisdiction }) {
  // Return dummy data for testing without API Key
  return {
    issueTitle: "Sample Legal Dispute",
    category: "General Law",
    jurisdiction: jurisdiction || "India",
    summary: "Based on your description, this appears to be a standard legal dispute. This is a mock analysis generated for testing purposes because the AI backend is currently in dummy mode.",
    keyFacts: [
      "This is a mocked key fact 1.",
      "This is a mocked key fact 2.",
      "The situation involves: " + situation.substring(0, 30) + "..."
    ],
    missingInformation: [
      "Exact dates of the incident.",
      "Any written communication between parties."
    ],
    possibleLegalAreas: [
      "Breach of Contract",
      "Civil Dispute"
    ],
    evidenceChecklist: [
      "Relevant Contracts or Agreements",
      "Bank Statements",
      "Emails or Messages",
      "Photographic Evidence"
    ],
    actionPlan: [
      { title: "Gather Evidence", description: "Collect all relevant documents and communications.", status: "Not started", notes: "" },
      { title: "Send Formal Notice", description: "Draft a formal communication stating your demands.", status: "Not started", notes: "" },
      { title: "Consult Professional", description: "Speak with a legal professional in your jurisdiction.", status: "Not started", notes: "" }
    ],
    questionsForProfessional: [
      "What is the statute of limitations for this issue?",
      "What are the typical legal costs involved?"
    ],
    riskSignals: [
      "The opposing party might dispute the timeline."
    ],
    uncertainties: [
      "Missing documentation could weaken the position."
    ],
    disclaimer: "AI-generated dummy data for testing purposes. This is not legal advice."
  };
}

export async function explainText({ text, jurisdiction }) {
  return {
    simpleExplanation: "This is a dummy explanation of the text you provided. It typically means that one party agrees to certain terms as outlined in the document.",
    importantPoints: [
      "You must provide notice before terminating.",
      "There may be financial penalties for breach."
    ],
    partiesMentioned: [
      "Party A (First Party)",
      "Party B (Second Party)"
    ],
    obligations: [
      "Maintain confidentiality.",
      "Fulfill the agreed upon duties."
    ],
    dates: [
      "Effective Date: [Date]",
      "Termination Date: [Date]"
    ],
    questionsToConsider: [
      "Are there any hidden fees?",
      "Can this agreement be modified unilaterally?"
    ],
    potentiallyUnclearSections: [
      "The liability clause seems vague regarding termination conditions."
    ],
    disclaimer: "AI-generated dummy data for testing purposes. This is not legal advice."
  };
}

export async function generateDocument({ type, caseInfo, instructions }) {
  return {
    title: `Draft: ${type}`,
    content: `[YOUR NAME]\n[YOUR ADDRESS]\n\nDate: [TODAY'S DATE]\n\n[RECIPIENT NAME]\n[RECIPIENT ADDRESS]\n\nSubject: ${type}\n\nDear [RECIPIENT NAME],\n\nThis is a mock generated document based on your request. Please ensure you replace all bracketed information with your actual details.\n\nAccording to the case information provided, this document is intended to address the situation in a formal manner. \n\nBased on your specific instructions: ${instructions || 'No special instructions provided.'}\n\nPlease consider this a formal notice regarding the matter at hand. I expect a prompt resolution.\n\nSincerely,\n\n[YOUR NAME]`,
    disclaimer: "AI-generated mock draft. Review with a qualified legal professional before use."
  };
}
