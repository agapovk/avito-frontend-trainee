import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header';

// const issue = {
//   "id": 1,
//   "title": "Реализация новой галереи изображений",
//   "description": "Реализация нового UI компонента с учетом гайдлайнов дизайн-системы. Детали будут уточнены в процессе разработки.",
//   "priority": "High",
//   "status": "Done",
//   "assigneeId": 0,
//   "assignee": {
//     "id": 2,
//     "fullName": "Илья Романов",
//     "email": "il.romanov@avito.ru",
//     "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg"
//   },
//   "boardId": 0,
//   "boardName": "Редизайн карточки товара"
// },

describe('Header', () => {
  it('Should render links and create button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const menuItems = screen.getAllByRole('link');
    const createButton = screen.getByText('Создать задачу');
    expect(menuItems.length).toBeGreaterThan(0);
    expect(createButton).toBeInTheDocument();
  });
});
