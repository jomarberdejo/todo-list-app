import API from "@/api/axios"
import type { Todo } from "@/types/todos"

export const useTodoActions = (onRefresh: () => void) => {

  const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")
    return token
  }

  const toggleStatus = async (todo: Todo) => {
    const updatedStatus =
      todo.status === "PENDING" ? "COMPLETED" : "PENDING"

    await API.put(
      `/todos/${todo.id}`,
      { status: updatedStatus },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    )

    onRefresh()
  }

  const deleteTodo = async (id: string) => {
    if (!confirm("Delete this todo?")) return

    await API.delete(`/todos/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })

    onRefresh()
  }

  const updateTodo = async (
    id: string,
    title: string,
    description: string
  ) => {
    await API.put(
      `/todos/${id}`,
      { title, description },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    )

    onRefresh()
  }

  return {
    toggleStatus,
    deleteTodo,
    updateTodo,
  }
}
