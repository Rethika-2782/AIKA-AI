import { Router } from "express";
import { analyze, explain, simplify, generateDocument, history } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.post("/analyze", analyze);
router.post("/explain", explain);
router.post("/generate-document", generateDocument);
router.post("/simplify", simplify);
router.get("/history", history);
export default router;
