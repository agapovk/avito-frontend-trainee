import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Board, Task } from '../types'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchBoardTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/boards/${id}`)
      const { data } = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching board tasks:', error)
    }
  }

  const fetchBoard = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/boards`)
      const { data } = await response.json()
      const boardById = id ? data.find((board: Board) => board.id === parseInt(id)) : null
      setBoard(boardById)
    } catch (error) {
      console.error('Error fetching board:', error)
    }
  }

  useEffect(() => {
    fetchBoard()
    fetchBoardTasks()
  }, [id])

  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || []
    acc[task.status].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  if (!tasks.length) {
    return <div>Loading...</div>
  }

  return (
    <>
      <section>
        <h2>{board?.name}</h2>
        <p>{board?.description}</p>
      </section>
      <section>
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="status-column">
            <h2>{status}</h2>
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  )
}
