import { useEffect, useState } from 'react'
import { Board } from '../types'
import BoardCard from './BoardCard'

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([])

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/boards')
        const { data } = await response.json()
        setBoards(data)
      } catch (error) {
        console.error('Error fetching boards:', error)
      }
    }
    fetchBoards()
  }, [])

  return (
    <>
      <section className="space-y-2">
        <h2 className="font-semibold text-xl">Boards</h2>
        <p className="text-muted-foreground">The list of all boards</p>
      </section>
      <section className="space-y-4">
        <ul className="space-y-4">
          {boards.map((board) => (
            <li key={board.id}>
              <BoardCard {...board} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
