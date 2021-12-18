type Project = {
  id: string
  name: string
  tasks: number
}

type Todo = {
  id: string
  name: string
  completed: boolean
  createdAt: Date
}

type ToggleComplete = (todo: Todo) => void

type Add = (newTodo: string) => void
