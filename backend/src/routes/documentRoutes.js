import { Router } from "express";
import { getDocuments, createDocument, updateDocument, deleteDocument } from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/", getDocuments);
router.post("/", createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);
export default router;
