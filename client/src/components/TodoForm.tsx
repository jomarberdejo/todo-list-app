import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import API from "@/api/axios"

interface TodoFormProps {
  onSuccess: () => void
}

export const TodoForm = ({ onSuccess }: TodoFormProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      await API.post(
        "/todos",
        {
          title,
          description,
          dueDate: dueDate || null, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

   
      setTitle("")
      setDescription("")
      setDueDate("")

      onSuccess()
    } catch (err) {
      console.error(err)
      alert("Failed to add todo")
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Add Todo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
