import { Router } from "express";
import { sendMessage, chatHistory } from "../controllers/chatController";

const router = Router();


router.post("/message", sendMessage);
router.get("/history/:sessionId", chatHistory);

export default router;
