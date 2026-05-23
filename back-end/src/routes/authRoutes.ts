import { Router } from "express";
import { register, login, listUsers, createUser, updateUser, deleteUser } from "../controllers/authController";
import { auth, adminOnly } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, adminOnly, listUsers);
router.post("/users", auth, adminOnly, createUser);
router.put("/users/:id", auth, adminOnly, updateUser);
router.delete("/users/:id", auth, adminOnly, deleteUser);

export default router;
