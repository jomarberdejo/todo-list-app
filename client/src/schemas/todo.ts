import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;