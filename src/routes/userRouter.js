import { Router } from "express";
import { login } from "../controllers/loginController.js";

const router = Router();

router.get("/login", login);

export default router;
