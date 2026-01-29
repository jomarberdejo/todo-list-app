import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/makeError";
import { verifyAccessToken, type TokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        next(new UnauthorizedError("Invalid token"));
      } else if (error.name === "TokenExpiredError") {
        next(new UnauthorizedError("Token expired"));
      } else {
        next(error);
      }
    } else {
      next(new UnauthorizedError("Authentication failed"));
    }
  }
}