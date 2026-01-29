import prisma from "../config/db";
import { STATUS } from "../generated/prisma/enums";

export async function findTodosByUserId(userId: string) {
  return await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findTodoByIdAndUserId(todoId: string, userId: string) {
  return await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  });
}

export async function createTodo(data: {
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date,
  status?: STATUS;
}) {
  return await prisma.todo.create({
    data,
  });
}

export async function updateTodo(
  todoId: string,
  data: {
    title?: string;
    description?: string;
    dueDate?: Date,
    status?: STATUS;
  }
) {
  return await prisma.todo.update({
    where: { id: todoId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status || "PENDING" }),
      ...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate) }),
    },
  });
}

export async function deleteTodo(todoId: string) {
  return await prisma.todo.delete({
    where: { id: todoId },
  });
}