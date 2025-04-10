import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import BoardDialog from './BoardDialog';

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
    <header className="border-b">
      <nav className="flex justify-between items-center p-4 mx-auto md:max-w-5xl">
        <ul className="flex items-center gap-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button variant="link" className={cn('px-0', pathname === item.href && 'underline')}>
                <Link to={item.href}>{item.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <BoardDialog task={null} board={null} />
      </nav>
    </header>
  );
}
