import request from "supertest";
import { app } from "../../server";

const ROUTE = "/books";

describe("Books", () => {
  test("get books", async () => {
    const res = await request(app).get(ROUTE);
    expect(res.statusCode).toBe(200);
  });
});
