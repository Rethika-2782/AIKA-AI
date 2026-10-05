import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    jurisdiction: { type: String, default: "India" },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["active", "closed", "pending"], default: "active" },
    aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
    risks: { type: [String], default: [] },
    actionPath: { type: [mongoose.Schema.Types.Mixed], default: [] },
    questions: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Case = mongoose.model("Case", caseSchema);
