import * as engine from "./aikaEngine.js";

export async function generateDraft({ type, caseInfo, instructions }) {
  return engine.generateDocument({ type, caseInfo, instructions });
}
