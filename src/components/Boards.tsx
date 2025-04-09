import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Board } from '../types'

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
    <div>
      <h2>Boards</h2>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link to={`/board/${board.id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
