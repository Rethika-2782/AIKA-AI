import { Router } from "express";
import { getEvidence, createEvidence, updateEvidence, deleteEvidence } from "../controllers/evidenceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/", getEvidence);
router.post("/", createEvidence);
router.put("/:id", updateEvidence);
router.delete("/:id", deleteEvidence);
export default router;
