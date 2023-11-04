import "reflect-metadata";
import express, { Request, Response } from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import booksRouter from "./api/books/books.route";
import authRouter from "./api/auth/auth.route";
import errorHandler from "./middlewares/errorHandler.middleware";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import { container } from "./config/inversify.config";
import JwtStrategy from "./api/auth/jwt.strategy";

const jwtStrategy = container.get(JwtStrategy);
const port = process.env.PORT || 3000;
export const app = express();

export const prisma = new PrismaClient({
  log: process.env.DEBUG === "ON" ? ["query"] : undefined
});

dotenv.config();

async function main() {
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  passport.use(jwtStrategy);
  app.use(passport.initialize());

  app.use("/auth", authRouter);
  app.use("/books", booksRouter);

  app.use(errorHandler);

  // Catch unregistered routes
  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  await prisma.$connect();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("uncaughtException", (error, origin) => {
  console.log("Uncaught exception:\n");
  console.log(error);
  console.log("Exception origin:\n");
  console.log(origin);
});
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:\n");
  console.log(promise);
  console.log("Reason:\n");
  console.log(reason);
});
