/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import AuthController from "./auth.controller";
import { container } from "../../inversify.config";

const router = express.Router();

const authController = container.get(AuthController);

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/logout", authController.logout);

export default router;
