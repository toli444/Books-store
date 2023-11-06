import request from 'supertest';
import { app, prisma } from '../../server';
import { clearDB } from '../../utils/test.util';
import { UserRoles } from './auth.types';

describe('/auth', () => {
  afterAll(async () => {
    await clearDB();
    await prisma.$disconnect();
  });

  describe('register', () => {
    afterAll(async () => {
      await clearDB();
    });

    test('register successfully', async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@email.com',
        password: 'testpassword',
        passwordConfirm: 'testpassword'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: 'User registered successfully',
        user: {
          email: 'testuser@email.com',
          firstName: 'test',
          id: 1,
          lastName: 'user',
          role: 'CUSTOMER'
        }
      });
    });

    describe('payload validation', () => {
      test('no payload', async () => {
        const res = await request(app).post('/auth/register').send();

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            email: ['Email is required'],
            firstName: ['First name is required'],
            lastName: ['Last name is required'],
            password: ['Password is required'],
            passwordConfirm: ['Please confirm your password']
          }
        });
      });

      test('invalid payload', async () => {
        const res = await request(app).post('/auth/register').send({
          firstName: 1,
          lastName: 2,
          email: 'string',
          password: '1',
          passwordConfirm: '2'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            email: ['Invalid email'],
            firstName: ['Expected string, received number'],
            lastName: ['Expected string, received number'],
            password: ['Password must be more than 8 characters']
          }
        });
      });

      test('passwords do not match', async () => {
        const res = await request(app).post('/auth/register').send({
          firstName: 'test',
          lastName: 'user',
          email: 'testuser@email.com',
          password: 'testpassword',
          passwordConfirm: 'other'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: {
            passwordConfirm: ['Passwords do not match']
          }
        });
      });

      test('user already exists', async () => {
        const firstRes = await request(app).post('/auth/register').send({
          firstName: 'test',
          lastName: 'user',
          email: 'testuser_USER_1@email.com',
          password: 'testpassword',
          passwordConfirm: 'testpassword'
        });

        expect(firstRes.statusCode).toBe(201);

        const secondRes = await request(app).post('/auth/register').send({
          firstName: 'test',
          lastName: 'user',
          email: 'testuser_USER_1@email.com',
          password: 'testpassword',
          passwordConfirm: 'testpassword'
        });

        expect(secondRes.statusCode).toBe(409);
        expect(secondRes.body).toEqual({
          error: 'The email already exists'
        });
      });
    });
  });

  describe('login CUSTOMER', () => {
    beforeAll(async () => {
      await request(app).post('/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@email.com',
        password: 'testpassword',
        passwordConfirm: 'testpassword'
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    test('login successfully', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'testuser@email.com',
        password: 'testpassword'
      });

      expect(res.statusCode).toBe(200);
    });

    test('wrong credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'other@email.com',
        password: 'testpassword'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: 'Invalid username or password'
      });
    });

    test('token does not authorize', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'testuser@email.com',
        password: 'testpassword'
      });

      expect(loginResponse.statusCode).toBe(200);

      const { accessToken } = loginResponse.body as { accessToken: string };

      const res = await request(app)
        .post('/books/with-author-info')
        .set({ authorization: `Bearer ${accessToken}` })
        .send({
          name: 'Keep the Aspidistra Flying',
          authorFirstName: 'George',
          authorLastName: 'Orwell'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        error: 'Access denied. Insufficient permissions.'
      });
    });
  });

  describe('login ADMIN', () => {
    beforeAll(async () => {
      const registerResponse = await request(app).post('/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'adminuser@email.com',
        password: 'testpassword',
        passwordConfirm: 'testpassword'
      });

      const registerResponseBody = registerResponse.body as {
        user: { id: number };
      };

      await prisma.user.update({
        where: {
          id: registerResponseBody.user.id
        },
        data: {
          role: UserRoles.ADMIN
        }
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    test('login successfully', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'adminuser@email.com',
        password: 'testpassword'
      });

      expect(res.statusCode).toBe(200);
    });

    test('token does authorize', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'adminuser@email.com',
        password: 'testpassword'
      });

      expect(loginResponse.statusCode).toBe(200);

      const { accessToken } = loginResponse.body as { accessToken: string };

      const res = await request(app)
        .post('/books/with-author-info')
        .set({ authorization: `Bearer ${accessToken}` })
        .send({
          name: 'Keep the Aspidistra Flying',
          authorFirstName: 'George',
          authorLastName: 'Orwell'
        });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('logout', () => {
    beforeAll(async () => {
      await request(app).post('/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'adminuser@email.com',
        password: 'testpassword',
        passwordConfirm: 'testpassword'
      });
    });

    afterAll(async () => {
      await clearDB();
    });

    test('cookie reset', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'adminuser@email.com',
        password: 'testpassword'
      });

      expect(loginResponse.statusCode).toBe(200);

      const logoutResponse = await request(app).post('/auth/logout');
      const logoutCookies = (
        logoutResponse.headers as { 'set-cookie': Array<string> }
      )['set-cookie'];

      expect(logoutCookies).toEqual([
        'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
      ]);
    });
  });
});
