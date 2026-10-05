import mongoose from "mongoose";

const aiInteractionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null, index: true },
    type: { type: String, enum: ["analysis", "explanation", "document", "simplification"], required: true },
    input: { type: String, default: "" },
    output: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

export const AIInteraction = mongoose.model("AIInteraction", aiInteractionSchema);
