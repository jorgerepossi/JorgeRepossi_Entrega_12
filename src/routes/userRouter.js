import { Router } from "express";
import userManagement from "../controllers/loginController.js";

const router = Router();

router.get("/login", userManagement.getUser);
router.post("/login", userManagement.postUser);
router.get("/logout", userManagement.logOutUser);

export default router;
