import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, HttpStatusCode } from '../utils/AppError';
import { ZodError } from 'zod';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  if (error instanceof ZodError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      error: error.flatten().fieldErrors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('ERROR: ', error);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      error: error.meta?.cause || 'DB Error'
    });
  }

  console.log('Error: ', error);

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: "Internal server error'"
  });
};

export default errorHandler;
