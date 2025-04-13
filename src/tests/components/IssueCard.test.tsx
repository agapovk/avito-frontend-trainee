import IssueCard from '@/components/IssueCard';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('IssueCard', () => {
  it('Card should be rendered', () => {
    const testIssue = {
      id: 1,
      title: 'Test Issue',
      description: 'Test Description',
      priority: 'High',
      status: 'Done',
      boardId: 1,
      boardName: 'Test Board',
      assignee: {
        id: 1,
        fullName: 'Test User',
        email: 'test@mail.com',
        avatarUrl: 'http://url-adress.com',
      },
      assigneeId: 1,
    };

    render(
      <MemoryRouter>
        <IssueCard issue={testIssue} />
      </MemoryRouter>,
    );

    const title = screen.getByRole('heading');
    const boardName = screen.getByText(testIssue.boardName);
    const assigneeName = screen.getByText(testIssue.assignee.fullName);
    const assigneeEmail = screen.getByText(testIssue.assignee.email);
    const statusBadge = screen.getByText(testIssue.status);
    const priorityBadge = screen.getByText(testIssue.priority);

    expect(title).toBeInTheDocument();
    expect(boardName).toBeInTheDocument();
    expect(assigneeName).toBeInTheDocument();
    expect(assigneeEmail).toBeInTheDocument();
    expect(statusBadge).toBeInTheDocument();
    expect(priorityBadge).toBeInTheDocument();
  });
});
