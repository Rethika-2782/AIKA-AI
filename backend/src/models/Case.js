import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema({
  title: String,
  checked: { type: Boolean, default: false },
  custom: { type: Boolean, default: false }
}, { _id: true });

const caseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  jurisdiction: { type: String, default: "Other / Not sure" },
  category: String,
  description: String,
  analysis: { type: mongoose.Schema.Types.Mixed, default: null },
  evidence: { type: [evidenceSchema], default: [] },
  actionPlan: { type: [mongoose.Schema.Types.Mixed], default: [] },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }]
}, { timestamps: true });

caseSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model("Case", caseSchema);
