
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Todo } from "@/types/todos"

interface Props {
  todo: Todo | null
  title: string
  description: string
  setTitle: (v: string) => void
  setDescription: (v: string) => void
  onClose: () => void
  onSave: () => void
}

export const EditTodoDialog = ({
  todo,
  title,
  description,
  setTitle,
  setDescription,
  onClose,
  onSave,
}: Props) => {
  return (
    <Dialog open={!!todo} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
