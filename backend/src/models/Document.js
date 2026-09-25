import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null },
  type: { type: String, default: "Custom Draft" },
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
