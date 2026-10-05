import mongoose from "mongoose";
import { Case } from "../models/Case.js";
import { Consultation } from "../models/Consultation.js";
import { AIInteraction } from "../models/AIInteraction.js";
import { analyzeSituation, explainText, simplifyClause } from "../services/aikaEngine.js";
import { generateDraft } from "../services/documentService.js";

function resolveCaseId(req) {
  const id = req.body?.caseId;
  return id && mongoose.Types.ObjectId.isValid(id) ? id : null;
}

async function verifyCaseOwnership(req, caseId) {
  if (!caseId) return null;
  return Case.findOne({ _id: caseId, user: req.user._id });
}

async function recordInteraction(req, type, input, output, caseId) {
  try {
    await AIInteraction.create({ user: req.user._id, case: caseId, type, input: String(input || "").slice(0, 5000), output });
  } catch (e) {
    console.error("Failed to record AI interaction:", e.message);
  }
}

export async function analyze(req, res) {
  try {
    const { situation, jurisdiction } = req.body || {};
    if (!situation || situation.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please describe the situation in at least 10 characters" });
    }
    const caseId = resolveCaseId(req);
    const caseDoc = await verifyCaseOwnership(req, caseId);
    if (caseId && !caseDoc) return res.status(404).json({ success: false, message: "Case not found" });

    const jx = jurisdiction || caseDoc?.jurisdiction || req.user.jurisdiction || "India";
    const result = analyzeSituation({ situation, jurisdiction: jx });

    await recordInteraction(req, "analysis", situation, result, caseId);

    if (caseDoc) {
      caseDoc.aiAnalysis = result;
      caseDoc.risks = result.possibleRisks;
      caseDoc.actionPath = result.actionPath;
      caseDoc.questions = result.questionsForProfessional;
      await caseDoc.save();
      try {
        await Consultation.create({ user: req.user._id, case: caseId, questions: result.questionsForProfessional });
      } catch (e) {
        console.error("Consultation record failed:", e.message);
      }
    }
    res.json({ success: true, analysis: result, provider: "aika-engine" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Analysis failed" });
  }
}

export async function explain(req, res) {
  try {
    const { text } = req.body || {};
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please provide at least 10 characters of text" });
    }
    const caseId = resolveCaseId(req);
    const caseDoc = await verifyCaseOwnership(req, caseId);
    if (caseId && !caseDoc) return res.status(404).json({ success: false, message: "Case not found" });
    const result = explainText(text);
    await recordInteraction(req, "explanation", text, result, caseId);
    res.json({ success: true, explanation: result, provider: "aika-engine" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Explanation failed" });
  }
}

export async function simplify(req, res) {
  try {
    const { text } = req.body || {};
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please provide the legal text to simplify" });
    }
    const caseId = resolveCaseId(req);
    const caseDoc = await verifyCaseOwnership(req, caseId);
    if (caseId && !caseDoc) return res.status(404).json({ success: false, message: "Case not found" });
    const result = simplifyClause(text);
    await recordInteraction(req, "simplification", text, result, caseId);
    res.json({ success: true, simplification: result, provider: "aika-engine" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Simplification failed" });
  }
}

export async function generateDocument(req, res) {
  try {
    const { type, instructions } = req.body || {};
    if (!type) return res.status(400).json({ success: false, message: "Document type is required" });
    const caseId = resolveCaseId(req);
    const caseDoc = await verifyCaseOwnership(req, caseId);
    if (caseId && !caseDoc) return res.status(404).json({ success: false, message: "Case not found" });
    const result = await generateDraft({ type, caseInfo: caseDoc, instructions });
    await recordInteraction(req, "document", `${type}: ${instructions || ""}`, result, caseId);
    res.json({ success: true, document: result, provider: "aika-engine" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Document generation failed" });
  }
}

export async function history(req, res) {
  try {
    const filter = { user: req.user._id };
    if (req.query.caseId && mongoose.Types.ObjectId.isValid(req.query.caseId)) filter.case = req.query.caseId;
    if (req.query.type) filter.type = req.query.type;
    const interactions = await AIInteraction.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, history: interactions });
  } catch {
    res.status(500).json({ success: false, message: "Could not load AI history" });
  }
}
