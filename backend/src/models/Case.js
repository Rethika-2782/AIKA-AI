
import mongoose from 'mongoose';
const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Efficiency: Database Indexing
  description: String,
  status: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
}, { timestamps: true });
export const Case = mongoose.model('Case', caseSchema);
