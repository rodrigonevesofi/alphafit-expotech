import { Router } from "express";
import { workoutPlanController } from "../controllers/crudController";
const router = Router();
router.get("/", workoutPlanController.list);
router.post("/", workoutPlanController.create);
router.put("/:id", workoutPlanController.update);
router.delete("/:id", workoutPlanController.remove);
export default router;
