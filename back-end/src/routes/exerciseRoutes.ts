import { Router } from "express";
import { exerciseController } from "../controllers/crudController";
const router = Router();
router.get("/", exerciseController.list);
router.post("/", exerciseController.create);
router.put("/:id", exerciseController.update);
router.delete("/:id", exerciseController.remove);
export default router;
