import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createCase, deleteCase, getCase, listCases, updateCase } from "../controllers/caseController.js";

const router = Router();
router.use(auth);
router.get("/", listCases);
router.post("/", createCase);
router.get("/:id", getCase);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);
export default router;
