import { useEffect, useState } from 'react'
import { Issue } from '../types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import IssueCard from './IssueCard'

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
    <>
      <section className="space-y-2">
        <h2 className="font-semibold text-xl">Issues</h2>
        <p className="text-muted-foreground">The list of all tasks</p>
      </section>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <Input type="text" placeholder="search" className="w-2xs" />
          <Button variant="outline">Фильтр</Button>
        </div>
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li key={issue.id}>
              <IssueCard {...issue} />
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <Button className="">Создать задачу</Button>
        </div>
      </section>
    </>
  )
}
