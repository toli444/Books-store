const checkRoleMock = jest.fn();

import request from "supertest";
import { app, prisma } from "../../server";
import { clearDB } from "../../utils/test.util";
import { UserRoles } from "../auth/auth.types";
import { NextFunction } from "express";

jest.mock("../../middlewares/auth.middleware", () => ({
  authorize: jest.fn(
    (role: UserRoles) => (req: Request, res: Response, next: NextFunction) => {
      checkRoleMock(role);
      next();
    }
  )
}));

describe("/books", () => {
  afterAll(async () => {
    await clearDB();
    await prisma.$disconnect();
  });

  describe("get books", () => {
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
    });

    describe("get all", () => {
      test("OK", async () => {
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

      test("no auth check", async () => {
        await request(app).get("/books");

        expect(checkRoleMock).not.toHaveBeenCalled();
      });
    });

    describe("get one", () => {
      test("OK", async () => {
        const res = await request(app).get("/books/1");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          author: {
            firstName: "Paulo",
            id: 1,
            lastName: "Coelho"
          },
          authorId: 1,
          id: 1,
          name: "The Alchemist"
        });
      });

      test("no auth check", async () => {
        await request(app).get("/books");

        expect(checkRoleMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("post book", () => {
    beforeAll(async () => {
      await prisma.author.create({
        data: {
          firstName: "George",
          lastName: "Orwell"
        }
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    test("OK", async () => {
      const res = await request(app).post("/books").send({
        name: "Animal Farm",
        authorId: 1
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        author: {
          firstName: "George",
          id: 1,
          lastName: "Orwell"
        },
        authorId: 1,
        id: 1,
        name: "Animal Farm"
      });
    });

    test("auth check", async () => {
      await request(app).post("/books").send({
        name: "Animal Farm",
        authorId: 1
      });

      expect(checkRoleMock).toHaveBeenCalledWith("ADMIN");
    });

    describe("payload validation", () => {
      test("no payload", async () => {
        const res = await request(app).post("/books");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            authorId: ["Expected number, received nan"],
            name: ["Book name is required."]
          }
        });
      });

      test("invalid payload", async () => {
        const res = await request(app).post("/books").send({
          name: 1,
          authorId: "string"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            authorId: ["Expected number, received nan"],
            name: ["Expected string, received number"]
          }
        });
      });
    });

    test("duplicated data", async () => {
      const firstRes = await request(app).post("/books").send({
        name: "Burmese Days",
        authorId: 1
      });

      expect(firstRes.statusCode).toBe(200);

      const secondRes = await request(app).post("/books").send({
        name: "Burmese Days",
        authorId: 1
      });

      expect(secondRes.statusCode).toBe(400);
      expect(secondRes.body).toEqual({
        error: "DB Error"
      });
    });
  });

  describe("put book", () => {
    beforeAll(async () => {
      await prisma.author.create({
        data: {
          firstName: "George",
          lastName: "Orwell"
        }
      });

      await prisma.book.create({
        data: {
          name: "Nineteen Eighty-Four",
          authorId: 1
        }
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    test("OK", async () => {
      const res = await request(app).put("/books/1").send({
        name: "1984",
        authorId: 1
      });

      expect(res.body).toEqual({
        author: {
          firstName: "George",
          id: 1,
          lastName: "Orwell"
        },
        authorId: 1,
        id: 1,
        name: "1984"
      });
      expect(res.statusCode).toBe(200);
    });

    test("auth check", async () => {
      await request(app).post("/books").send({
        name: "Animal Farm",
        authorId: 1
      });

      expect(checkRoleMock).toHaveBeenCalledWith("ADMIN");
    });

    describe("payload validation", () => {
      test("no payload", async () => {
        const res = await request(app).put("/books/1");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            authorId: ["Expected number, received nan"],
            name: ["Book name is required."]
          }
        });
      });

      test("invalid payload", async () => {
        const res = await request(app).put("/books/1").send({
          name: 1,
          authorId: "string"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            authorId: ["Expected number, received nan"],
            name: ["Expected string, received number"]
          }
        });
      });
    });
  });
});
