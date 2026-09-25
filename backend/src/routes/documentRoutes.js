import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createDocument, deleteDocument, listDocuments } from "../controllers/documentController.js";

const router = Router();
router.use(auth);
router.get("/", listDocuments);
router.post("/", createDocument);
router.delete("/:id", deleteDocument);
export default router;
