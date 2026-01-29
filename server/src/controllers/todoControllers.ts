import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth";
import * as todoService from "../services/todoService";
import { UnauthorizedError } from "../utils/makeError";

export async function getAllTodos(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const todos = await todoService.getAllUserTodos(req.user.userId);

    res.json({ todos });
  } catch (error) {
    next(error);
  }
}

export async function createTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { title, description, status } = req.body;

    const todo = await todoService.createUserTodo(
      req.user.userId,
      title,
      description,
      status
    );

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTodoById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { id } = req.params;

    const todo = await todoService.getUserTodoById(req.user.userId, id as string);

    res.json({ todo });
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await todoService.updateUserTodo(req.user.userId, id as string, {
      title,
      description,
      status,
    });

    res.json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { id } = req.params;

    const result = await todoService.deleteUserTodo(req.user.userId, id as string);

    res.json(result);
  } catch (error) {
    next(error);
  }
}