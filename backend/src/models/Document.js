import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null, index: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, default: "Custom Draft" },
    content: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
