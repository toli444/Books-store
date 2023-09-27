import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import booksRouter from "./routes/books.route";

export const prisma = new PrismaClient();

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

async function main() {
  app.use(express.json());
  app.use("/books", booksRouter);

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

async function testDB() {
  // await prisma.book.create({
  //   data: {
  //     name: "The Alchemist",
  //     author: {
  //       create: {
  //         name: "Paulo Coelho"
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

  // await prisma.autor.create({
  //   data: {
  //     name: "Miguel de Cervantes"
  //   }
  // });

  const allAuthors = await prisma.autor.findMany();

  console.log("ALL AUTHORS: ", allAuthors);
}
