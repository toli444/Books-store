import request from "supertest";
import { app, prisma } from "../../server";

const ROUTE = "/books";

describe("Books", () => {
  beforeAll(async () => {
    await prisma.book.create({
      data: {
        name: "The Alchemist",
        author: {
          create: {
            firstName: "Paulo",
            lastName: "Coelho"
          }
        }
      }
    });
  });

  afterAll(async () => {
    const deleteBooks = prisma.book.deleteMany();
    const deleteAuthors = prisma.author.deleteMany();

    await prisma.$transaction([deleteBooks, deleteAuthors]);
    await prisma.$disconnect();
  });

  test("/GET books", async () => {
    const res = await request(app).get(ROUTE);
    expect(res.statusCode).toBe(200);
  });
});
