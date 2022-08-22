import { Router } from "express";
import AuthController from "./../controllers/Auth.controller.js";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);

export default authRouter;
