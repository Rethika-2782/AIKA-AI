import mongoose from "mongoose";
import { Case } from "../models/Case.js";

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function getCases(req, res) {
  try {
    const { status, category, search } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    const cases = await Case.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, cases });
  } catch {
    res.status(500).json({ success: false, message: "Could not load cases" });
  }
}

export async function createCase(req, res) {
  try {
    const { title, description, jurisdiction, category, status } = req.body || {};
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const newCase = await Case.create({
      user: req.user._id,
      title,
      description,
      jurisdiction: jurisdiction || req.user.jurisdiction,
      category,
      status
    });
    res.status(201).json({ success: true, case: newCase });
  } catch {
    res.status(500).json({ success: false, message: "Could not create case" });
  }
}

export async function getCase(req, res) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid case ID" });
    const found = await Case.findOne({ _id: req.params.id, user: req.user._id });
    if (!found) return res.status(404).json({ success: false, message: "Case not found" });
    res.json({ success: true, case: found });
  } catch {
    res.status(500).json({ success: false, message: "Could not load case" });
  }
}

export async function updateCase(req, res) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid case ID" });
    const allowed = ["title", "description", "jurisdiction", "category", "status", "aiAnalysis", "risks", "actionPath", "questions"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const updated = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Case not found" });
    res.json({ success: true, case: updated });
  } catch {
    res.status(500).json({ success: false, message: "Could not update case" });
  }
}

export async function deleteCase(req, res) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid case ID" });
    const deleted = await Case.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Case not found" });
    res.json({ success: true, message: "Case deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Could not delete case" });
  }
}
