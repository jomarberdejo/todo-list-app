import type { Request, Response, NextFunction } from "express";
import { makeError } from "../utils/makeError";

export function errorHandlerMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const { statusCode, error } = makeError(err);
  console.error(`[${statusCode}] ${error.name}: ${error.message}`);
  res.status(statusCode).json(error);
}
