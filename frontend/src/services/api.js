// Mock API Client using LocalStorage

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const mockAI = {
  analyze: (situation, jurisdiction) => ({
    issueTitle: "Sample Legal Dispute",
    category: "General Law",
    jurisdiction: jurisdiction || "India",
    summary: "Based on your description, this appears to be a standard legal dispute. This is a mock analysis generated for testing purposes because the app is running in frontend-only mode.",
    keyFacts: ["This is a mocked key fact 1.", "This is a mocked key fact 2.", "The situation involves: " + situation.substring(0, 30) + "..."],
    missingInformation: ["Exact dates of the incident.", "Any written communication between parties."],
    possibleLegalAreas: ["Breach of Contract", "Civil Dispute"],
    evidenceChecklist: ["Relevant Contracts", "Bank Statements", "Emails"],
    actionPlan: [
      { title: "Gather Evidence", description: "Collect all relevant documents.", status: "Not started" },
      { title: "Send Formal Notice", description: "Draft a formal communication.", status: "Not started" }
    ],
    questionsForProfessional: ["What is the statute of limitations?", "What are the typical legal costs?"],
    riskSignals: ["The opposing party might dispute the timeline."],
    uncertainties: ["Missing documentation could weaken the position."],
    disclaimer: "AI-generated dummy data for testing purposes."
  })
};

function getStorage(key, defaultVal = []) {
  try { return JSON.parse(localStorage.getItem(key)) || defaultVal; } 
  catch { return defaultVal; }
}
function setStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export const api = {
  register: async (body) => {
    await delay(500);
    const user = { id: Date.now().toString(), name: body.name, email: body.email, jurisdiction: body.jurisdiction };
    localStorage.setItem("lexora_user", JSON.stringify(user));
    return { token: "mock_token_123", user };
  },
  login: async (body) => {
    await delay(500);
    const user = { id: "demo", name: body.email.split("@")[0], email: body.email, jurisdiction: body.jurisdiction || "India" };
    localStorage.setItem("lexora_user", JSON.stringify(user));
    return { token: "mock_token_123", user };
  },
  me: async () => {
    await delay(200);
    const user = localStorage.getItem("lexora_user");
    if(!user) throw new Error("Not logged in");
    return JSON.parse(user);
  },
  
  analyze: async (body) => {
    await delay(1500);
    return mockAI.analyze(body.situation, body.jurisdiction);
  },
  explain: async () => {
    await delay(1000);
    return { simpleExplanation: "Mock explanation." };
  },
  generateDocument: async () => {
    await delay(1500);
    return { title: "Mock Draft", content: "This is a frontend-only mock draft." };
  },
  
  listCases: async () => {
    await delay(300);
    return getStorage("lexora_cases", []);
  },
  getCase: async (id) => {
    await delay(300);
    const cases = getStorage("lexora_cases", []);
    const c = cases.find(x => x._id === id);
    if(!c) throw new Error("Case not found");
    return c;
  },
  createCase: async (body) => {
    await delay(500);
    const newCase = { ...body, _id: Date.now().toString(), evidence: [], createdAt: new Date().toISOString() };
    const cases = getStorage("lexora_cases", []);
    setStorage("lexora_cases", [...cases, newCase]);
    return newCase;
  },
  updateCase: async (id, body) => {
    await delay(300);
    const cases = getStorage("lexora_cases", []);
    const idx = cases.findIndex(x => x._id === id);
    if(idx === -1) throw new Error("Case not found");
    cases[idx] = { ...cases[idx], ...body };
    setStorage("lexora_cases", cases);
    return cases[idx];
  },
  deleteCase: async (id) => {
    await delay(300);
    const cases = getStorage("lexora_cases", []);
    setStorage("lexora_cases", cases.filter(x => x._id !== id));
    return { success: true };
  }
};
