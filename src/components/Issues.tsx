import { useEffect, useState } from 'react'
import { Issue } from '../types'

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/tasks')
        const { data } = await response.json()
        setIssues(data)
      } catch (error) {
        console.error('Error fetching issues:', error)
      }
    }
    fetchIssues()
  }, [])

  return (
    <main>
      <section>
        <h2>Issues</h2>
      </section>
      <section>
        <div>
          <input type="text" placeholder="search" />
          <button>Фильтр</button>
        </div>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>{issue.title}</li>
          ))}
        </ul>
        <button>Создать задачу</button>
      </section>
    </main>
  )
}
