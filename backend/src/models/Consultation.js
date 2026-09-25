import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null },
  questions: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Consultation", consultationSchema);
