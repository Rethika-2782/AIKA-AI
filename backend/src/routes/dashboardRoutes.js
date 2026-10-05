import { Router } from "express";
import { Case } from "../models/Case.js";
import { Document } from "../models/Document.js";
import { EvidenceItem } from "../models/EvidenceItem.js";
import { AIInteraction } from "../models/AIInteraction.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/stats", protect, async (req, res) => {
  try {
    const user = req.user._id;
    const [totalCases, activeCases, documents, evidence, interactions, recentCases] = await Promise.all([
      Case.countDocuments({ user }),
      Case.countDocuments({ user, status: "active" }),
      Document.countDocuments({ user }),
      EvidenceItem.countDocuments({ user }),
      AIInteraction.countDocuments({ user }),
      Case.find({ user }).sort({ updatedAt: -1 }).limit(5)
    ]);
    const recentActivity = await AIInteraction.find({ user }).sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, stats: { totalCases, activeCases, documents, evidence, interactions }, recentCases, recentActivity });
  } catch {
    res.status(500).json({ success: false, message: "Could not load dashboard stats" });
  }
});
export default router;
