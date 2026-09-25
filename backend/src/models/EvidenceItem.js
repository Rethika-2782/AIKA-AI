import mongoose from "mongoose";

const evidenceItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
  title: { type: String, required: true },
  checked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("EvidenceItem", evidenceItemSchema);
