import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", default: null, index: true },
    questions: { type: [String], default: [] },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Consultation = mongoose.model("Consultation", consultationSchema);
