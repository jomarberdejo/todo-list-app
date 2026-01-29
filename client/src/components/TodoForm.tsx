"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/api/axios";
import { todoSchema, type TodoFormValues } from "@/schemas/todo";

interface TodoFormProps {
  onSuccess: () => void;
}


export const TodoForm = ({ onSuccess }: TodoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = async (data: TodoFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await API.post(
        "/todos",
        {
          title: data.title,
          description: data.description || "",
          dueDate: data.dueDate || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      reset();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to add todo");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-4"
        >
          <div className="flex flex-col">
            <Input placeholder="Title" {...register("title")} />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Input placeholder="Description" {...register("description")} />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Input type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <span className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Todo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
