import { Router } from "express";
import { analyze, explain, document } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.use(auth);
router.post("/analyze", analyze);
router.post("/explain", explain);
router.post("/generate-document", document);
export default router;
