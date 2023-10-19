import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals = schema.parse({ ...req.body, ...req.params });
    next();
  };

export default validate;
