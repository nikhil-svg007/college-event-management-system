
import express from "express";
import { generateDescription, chatHandler } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-description", generateDescription);
router.post("/chat", chatHandler);

export default router;
