import BoardCard from '@/components/BoardCard';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('BoardCard', () => {
  it('Card should be rendered', () => {
    const testBoard = {
      id: 1,
      name: 'Test Board',
      description: 'Test Description',
      taskCount: 10,
    };

    render(
      <MemoryRouter>
        <BoardCard board={testBoard} />
      </MemoryRouter>,
    );

    const title = screen.getByRole('heading');
    const description = screen.getByRole('paragraph');
    const link = screen.getByRole('link', { name: 'Перейти к доске' });

    expect(title).toHaveTextContent(testBoard.name);
    expect(description).toHaveTextContent(testBoard.description);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/board/${testBoard.id}`);
  });
});
