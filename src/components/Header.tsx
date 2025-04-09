import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/issues">Все задачи</Link>
          </li>
          <li>
            <Link to="/boards">Проекты</Link>
          </li>
        </ul>
      </nav>
      <button>Создать задачу</button>
    </header>
  )
}
