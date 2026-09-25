import Document from "../models/Document.js";

export async function listDocuments(req, res) {
  res.json(await Document.find({ userId: req.user.id }).sort({ updatedAt: -1 }));
}

export async function createDocument(req, res) {
  const { caseId, type, title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content are required." });
  const doc = await Document.create({ userId: req.user.id, caseId: caseId || null, type, title, content });
  res.status(201).json(doc);
}

export async function deleteDocument(req, res) {
  const result = await Document.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (!result.deletedCount) return res.status(404).json({ message: "Document not found." });
  res.json({ message: "Document deleted." });
}
