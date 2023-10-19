import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError, HttpCode } from "../utils/AppError";
import { ZodError } from "zod";

const errorHandler = (error: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  console.log("Error: ", error);

  if (error instanceof AppError) {
    return res.status(error.httpCode).json({
      error: error.message
    });
  }

  if (error instanceof ZodError) {
    return res.status(HttpCode.BAD_REQUEST).json({
      error: error.flatten().fieldErrors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(HttpCode.BAD_REQUEST).json({
      error: error.meta?.cause || "DB Error"
    });
  }

  res.status(500).json({
    error: "Internal server error'"
  });
};

export default errorHandler;
