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
    await prisma.$disconnect();
  });

  test("/GET books", async () => {
    const res = await request(app).get(ROUTE);
    expect(res.statusCode).toBe(200);
  });
});
