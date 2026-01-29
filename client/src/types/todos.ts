export interface Todo {
  id: string
  title: string
  description?: string
  status: "PENDING" | "COMPLETED"
  dueDate: string
  createdAt: string
}
