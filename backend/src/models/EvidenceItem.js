import mongoose from "mongoose";

const evidenceItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Rental Agreement", "Payment Receipt", "Email Conversation", "Legal Notice", "Photograph", "Other"],
      default: "Other"
    },
    status: { type: String, enum: ["collected", "pending", "missing"], default: "pending" }
  },
  { timestamps: true }
);

export const EvidenceItem = mongoose.model("EvidenceItem", evidenceItemSchema);
