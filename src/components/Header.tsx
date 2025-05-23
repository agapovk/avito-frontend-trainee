import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NewForm from './NewForm';

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

const Header = React.memo(function Header() {
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="border-b">
      <nav className="flex justify-between items-center p-4 mx-auto md:max-w-5xl">
        <ul className="flex items-center gap-4">
          {menuItems.map(({ title, href }, index) => (
            <li key={index}>
              <Button variant="link" className={cn('px-0', pathname === href && 'underline')}>
                <Link to={href}>{title}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Создать задачу</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{'Создание задачи'}</DialogTitle>
              <DialogDescription>Заполните форму</DialogDescription>
            </DialogHeader>
            <NewForm setIsModalOpen={setIsModalOpen} />
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
});

export default Header;
