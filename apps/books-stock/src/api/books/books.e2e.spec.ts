import request from "supertest";
import { app, prisma } from "../../server";
import { clearDB } from "../../utils/test.util";

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

    await prisma.book.create({
      data: {
        name: "Nineteen Eighty-Four",
        author: {
          create: {
            firstName: "George",
            lastName: "Orwell"
          }
        }
      }
    });
  });

  afterAll(async () => {
    await clearDB();
    await prisma.$disconnect();
  });

  test("/GET books", async () => {
    const res = await request(app).get(ROUTE);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        author: {
          firstName: "Paulo",
          id: 1,
          lastName: "Coelho"
        },
        authorId: 1,
        id: 1,
        name: "The Alchemist"
      },
      {
        author: {
          firstName: "George",
          id: 2,
          lastName: "Orwell"
        },
        authorId: 2,
        id: 2,
        name: "Nineteen Eighty-Four"
      }
    ]);
  });
});
