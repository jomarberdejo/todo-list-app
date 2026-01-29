import { useEffect, useState } from "react";
import API from "@/api/axios";
import { TodoTable } from "@/components/TodoTable";
import { TodoForm } from "@/components/TodoForm";
import type { Todo } from "@/types/todos";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { logout } = useAuth();

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await API.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(res.data.todos);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Todo List Application</h1>

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      <TodoForm onSuccess={fetchTodos} />

      <TodoTable data={todos} onRefresh={fetchTodos} />
    </div>
  );
}
