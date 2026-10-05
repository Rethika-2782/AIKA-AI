import mongoose from "mongoose";
import { EvidenceItem } from "../models/EvidenceItem.js";

export async function getEvidence(req, res) {
  try {
    const filter = { user: req.user._id };
    if (req.query.caseId && mongoose.Types.ObjectId.isValid(req.query.caseId)) filter.case = req.query.caseId;
    const items = await EvidenceItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, evidence: items });
  } catch {
    res.status(500).json({ success: false, message: "Could not load evidence" });
  }
}

export async function createEvidence(req, res) {
  try {
    const { name, description, type, status, caseId } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const item = await EvidenceItem.create({
      user: req.user._id,
      case: caseId && mongoose.Types.ObjectId.isValid(caseId) ? caseId : null,
      name, description, type, status
    });
    res.status(201).json({ success: true, evidenceItem: item });
  } catch {
    res.status(500).json({ success: false, message: "Could not add evidence" });
  }
}

export async function updateEvidence(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const allowed = ["name", "description", "type", "status", "case"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const updated = await EvidenceItem.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Evidence item not found" });
    res.json({ success: true, evidenceItem: updated });
  } catch {
    res.status(500).json({ success: false, message: "Could not update evidence" });
  }
}

export async function deleteEvidence(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const deleted = await EvidenceItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Evidence item not found" });
    res.json({ success: true, message: "Evidence item deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Could not delete evidence" });
  }
}
