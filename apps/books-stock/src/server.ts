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
import { container } from "./inversify.config";
import JwtStrategy from "./api/auth/jwt.strategy";

const jwtStrategy = container.get(JwtStrategy);

export const prisma = new PrismaClient();

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

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

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  await testDB();
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

process.on("unhandledRejection", (reason: Error | any) => {
  throw new Error(reason?.message || reason);
});

async function testDB() {
  // await prisma.book.create({
  //   data: {
  //     name: "The Alchemist",
  //     author: {
  //       create: {
  //         firstName: "Paulo",
  //         lastName: "Coelho"
  //       }
  //     }
  //   }
  // });

  const allBooks = await prisma.book.findMany({
    include: {
      author: true
    }
  });

  console.log("ALL BOOKS: ", allBooks);

  // await prisma.author.create({
  //   data: {
  //     name: "Miguel de Cervantes"
  //   }
  // });

  const allAuthors = await prisma.author.findMany();

  console.log("ALL AUTHORS: ", allAuthors);
}
