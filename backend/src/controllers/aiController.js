import { analyzeSituation, explainText, generateDocument } from "../services/gemini.js";

export async function analyze(req, res) {
  try {
    const { situation, jurisdiction } = req.body;
    if (!situation?.trim()) return res.status(400).json({ message: "Please describe the situation." });
    if (situation.trim().length < 15) return res.status(400).json({ message: "Please provide a little more information." });

    const result = await analyzeSituation({
      situation: situation.trim(),
      jurisdiction: jurisdiction || "Other / Not sure"
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || "Unable to analyze the situation. Please try again." });
  }
}

export async function explain(req, res) {
  try {
    const { text, jurisdiction } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Please paste some text to explain." });
    const result = await explainText({ text: text.trim(), jurisdiction: jurisdiction || "Other / Not sure" });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || "Unable to simplify the text." });
  }
}

export async function document(req, res) {
  try {
    const { type, caseInfo, instructions } = req.body;
    if (!type || !caseInfo) return res.status(400).json({ message: "Document type and case information are required." });
    const result = await generateDocument({ type, caseInfo, instructions });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || "Unable to generate the draft." });
  }
}
