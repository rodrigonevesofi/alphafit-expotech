import { Router } from "express";
import { sendMessage, streamMessage, chatHistory } from "../controllers/chatController";

const router = Router();


router.post("/message", sendMessage);
router.post("/message/stream", streamMessage);
router.get("/history/:sessionId", chatHistory);

export default router;
