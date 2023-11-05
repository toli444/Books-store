import { exec } from "child_process";
import * as util from "util";
import request from "supertest";
import { app } from "../server";
import { PrismaClient } from "@prisma/client";
import { UserRoles } from "../api/auth/auth.types";

const execPromisify = util.promisify(exec);

export const clearDB = async () => execPromisify("npm run test:db:reset");

export const authenticate = async ({
  role,
  prisma
}: {
  role: UserRoles;
  prisma: PrismaClient;
}) => {
  const registerResponse = await request(app)
    .post("/auth/register")
    .send({
      firstName: "test",
      lastName: "user",
      email: `testuser_${role}@email.com`,
      password: "testpassword",
      passwordConfirm: "testpassword"
    });

  const registerResponseBody = registerResponse.body as {
    user: { id: number };
  };

  await prisma.user.update({
    where: {
      id: registerResponseBody.user.id
    },
    data: {
      role
    }
  });

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: `testuser_${role}@email.com`,
      password: "testpassword"
    });

  const loginResponseBody = loginResponse.body as { accessToken: string };

  return loginResponseBody.accessToken;
};
