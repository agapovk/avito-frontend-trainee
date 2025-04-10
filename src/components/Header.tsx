import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Все задачи',
    href: '/issues',
  },
  {
    title: 'Проекты',
    href: '/boards',
  },
];
export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <nav>
        <ul className="flex items-center gap-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button variant="link" className={cn('px-0', pathname === item.href && 'underline')}>
                <Link to={item.href}>{item.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <Button>Создать задачу</Button>
    </header>
  );
}
