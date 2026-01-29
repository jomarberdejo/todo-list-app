import * as todoData from "../data/todoData";
import { STATUS } from "../generated/prisma/enums";
import { BadRequestError, NotFoundError } from "../utils/makeError";

export async function getAllUserTodos(userId: string) {
  return await todoData.findTodosByUserId(userId);
}

export async function createUserTodo(
  userId: string,
  title: string,
  description?: string,
  dueDate?: Date,
  status?: STATUS,
) {
  if (!title) {
    throw new BadRequestError("Title is required");
  }

  const todoDataObj: {
    userId: string;
    title: string;
    description?: string;
    dueDate?: Date;
    status?: STATUS;
  } = {
    userId,
    title,
    ...(dueDate && { dueDate: new Date(dueDate) }),
    status,
  };

  if (description !== undefined) {
    todoDataObj.description = description;
  }


  return await todoData.createTodo(todoDataObj);
}

export async function getUserTodoById(userId: string, todoId: string) {
  const todo = await todoData.findTodoByIdAndUserId(todoId, userId);

  if (!todo) {
    throw new NotFoundError("Todo not found");
  }

  return todo;
}

export async function updateUserTodo(
  userId: string,
  todoId: string,
  data: {
    title?: string;
    description?: string;
    status: STATUS;
  },
) {
  const existingTodo = await todoData.findTodoByIdAndUserId(todoId, userId);

  if (!existingTodo) {
    throw new NotFoundError("Todo not found");
  }

  return await todoData.updateTodo(todoId, data);
}

export async function deleteUserTodo(userId: string, todoId: string) {
  const existingTodo = await todoData.findTodoByIdAndUserId(todoId, userId);

  if (!existingTodo) {
    throw new NotFoundError("Todo not found");
  }

  await todoData.deleteTodo(todoId);

  return { message: "Todo deleted successfully" };
}
