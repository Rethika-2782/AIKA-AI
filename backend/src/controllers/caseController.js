import Case from "../models/Case.js";

export async function listCases(req, res) {
  const cases = await Case.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(cases);
}

export async function createCase(req, res) {
  const { title, jurisdiction, category, description, analysis } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description are required." });

  const evidence = (analysis?.evidenceChecklist || []).map(x => ({
    title: typeof x === "string" ? x : x.title,
    checked: false
  }));

  const created = await Case.create({
    userId: req.user.id,
    title,
    jurisdiction: jurisdiction || "Other / Not sure",
    category: category || analysis?.category || "General",
    description,
    analysis: analysis || null,
    evidence,
    actionPlan: analysis?.actionPlan || []
  });
  res.status(201).json(created);
}

export async function getCase(req, res) {
  const item = await Case.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: "Case not found." });
  res.json(item);
}

export async function updateCase(req, res) {
  const allowed = ["title", "jurisdiction", "category", "description", "analysis", "evidence", "actionPlan"];
  const update = {};
  for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];

  const item = await Case.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Case not found." });
  res.json(item);
}

export async function deleteCase(req, res) {
  const result = await Case.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (!result.deletedCount) return res.status(404).json({ message: "Case not found." });
  res.json({ message: "Case deleted." });
}
