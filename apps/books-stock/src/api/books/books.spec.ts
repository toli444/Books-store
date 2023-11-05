const checkRoleMock = jest.fn(
  (req: Request, res: Response, next: NextFunction) => next()
);

import request from "supertest";
import { app, prisma } from "../../server";
import { clearDB, authenticate } from "../../utils/test.util";
import { UserRoles } from "../auth/auth.types";
import { NextFunction } from "express";

jest.mock("../../middlewares/auth.middleware", () => ({
  authorize: jest.fn(() => checkRoleMock)
}));

describe("/books", () => {
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

  test("get books", async () => {
    const res = await request(app).get("/books");

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

  describe("protected urls", () => {
    let ADMIN_TOKEN: string;
    let CUSTOMER_TOKEN: string;

    beforeAll(async () => {
      ADMIN_TOKEN = await authenticate({ role: UserRoles.ADMIN, prisma });
      CUSTOMER_TOKEN = await authenticate({ role: UserRoles.CUSTOMER, prisma });
    });

    describe("post book", () => {
      test("NO ROLE", async () => {
        const res = await request(app).post("/books").send({
          name: "Animal Farm",
          authorId: 2
        });

        expect(res.statusCode).toBe(401);
      });

      test("CUSTOMER ROLE", async () => {
        const res = await request(app)
          .post("/books")
          .send({
            name: "Animal Farm",
            authorId: 2
          })
          .set({ authorization: `Bearer ${CUSTOMER_TOKEN}` });

        expect(res.statusCode).toBe(403);
        expect(res.body).toEqual({
          error: "Access denied. Insufficient permissions."
        });
      });

      test("ADMIN ROLE", async () => {
        const res = await request(app)
          .post("/books")
          .send({
            name: "Animal Farm",
            authorId: 2
          })
          .set({ authorization: `Bearer ${ADMIN_TOKEN}` });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          author: {
            firstName: "George",
            id: 2,
            lastName: "Orwell"
          },
          authorId: 2,
          id: 3,
          name: "Animal Farm"
        });
      });
    });
  });
});
