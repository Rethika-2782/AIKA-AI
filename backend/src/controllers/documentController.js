import mongoose from "mongoose";
import { Document } from "../models/Document.js";

export async function getDocuments(req, res) {
  try {
    const filter = { user: req.user._id };
    if (req.query.caseId && mongoose.Types.ObjectId.isValid(req.query.caseId)) filter.case = req.query.caseId;
    const documents = await Document.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, documents });
  } catch {
    res.status(500).json({ success: false, message: "Could not load documents" });
  }
}

export async function createDocument(req, res) {
  try {
    const { title, type, content, caseId } = req.body || {};
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const doc = await Document.create({
      user: req.user._id,
      case: caseId && mongoose.Types.ObjectId.isValid(caseId) ? caseId : null,
      title, type, content
    });
    res.status(201).json({ success: true, document: doc });
  } catch {
    res.status(500).json({ success: false, message: "Could not save document" });
  }
}

export async function updateDocument(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const allowed = ["title", "type", "content", "case"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const updated = await Document.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, document: updated });
  } catch {
    res.status(500).json({ success: false, message: "Could not update document" });
  }
}

export async function deleteDocument(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const deleted = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, message: "Document deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Could not delete document" });
  }
}
