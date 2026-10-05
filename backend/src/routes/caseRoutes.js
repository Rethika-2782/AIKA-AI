import { Router } from "express";
import { getCases, createCase, getCase, updateCase, deleteCase } from "../controllers/caseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/", getCases);
router.post("/", createCase);
router.get("/:id", getCase);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);
export default router;
