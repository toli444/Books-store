import 'reflect-metadata';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import booksRouter from './api/books/books.route';
import authRouter from './api/auth/auth.route';
import authorsRouter from './api/authors/authors.route';
import statusRouter from './api/status/status.route';
import errorHandler from './middlewares/errorHandler.middleware';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { container } from './config/inversify.config';
import JwtStrategy from './api/auth/jwt.strategy';

const jwtStrategy = container.get(JwtStrategy);
export const app = express();

export const prisma = new PrismaClient();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

passport.use(jwtStrategy);
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/status', statusRouter);

app.use(errorHandler);

// Catch unregistered routes
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
