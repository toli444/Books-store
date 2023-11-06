const checkRoleMock = jest.fn();

import request from 'supertest';
import { app, prisma } from '../../server';
import { clearDB } from '../../utils/test.util';
import { UserRoles } from '../auth/auth.types';
import { NextFunction } from 'express';

jest.mock('../../middlewares/auth.middleware', () => ({
  authorize: jest.fn(
    (role: UserRoles) => (req: Request, res: Response, next: NextFunction) => {
      checkRoleMock(role);
      next();
    }
  )
}));

describe('/authors', () => {
  afterAll(async () => {
    await clearDB();
    await prisma.$disconnect();
  });

  describe("get author's books", () => {
    beforeAll(async () => {
      await prisma.book.create({
        data: {
          name: 'Nineteen Eighty-Four',
          author: {
            create: {
              firstName: 'George',
              lastName: 'Orwell'
            }
          }
        }
      });

      await prisma.book.create({
        data: {
          name: 'Animal Farm',
          authorId: 1
        }
      });

      await prisma.book.create({
        data: {
          name: 'The Alchemist',
          author: {
            create: {
              firstName: 'Paulo',
              lastName: 'Coelho'
            }
          }
        }
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    describe('get all', () => {
      test('OK', async () => {
        const res = await request(app).get('/authors/1/books');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
          {
            authorId: 1,
            id: 1,
            name: 'Nineteen Eighty-Four'
          },
          {
            authorId: 1,
            id: 2,
            name: 'Animal Farm'
          }
        ]);
      });

      test('no auth check', async () => {
        await request(app).get('/books');

        expect(checkRoleMock).not.toHaveBeenCalled();
      });
    });
  });
});
