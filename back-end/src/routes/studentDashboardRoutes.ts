import { Router } from "express";
import {
  getStudentDashboard,
  saveBiotype,
  createCheckIn,
} from "../controllers/studentDashboardController";

const router = Router();

router.get("/:userId", getStudentDashboard);
router.post("/:userId/biotype", saveBiotype);
router.post("/:userId/checkin", createCheckIn);

export default router;