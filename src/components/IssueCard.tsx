import { Issue } from '@/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function IssueCard(issue: Issue) {
  const getInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join('');
  };

  return (
    <Card className="p-0">
      <CardContent className="py-4">
        <h3 className="font-semibold">{issue.title}</h3>
        <p className="text-muted-foreground text-sm">{issue.boardName}</p>
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={issue.assignee.avatarUrl} alt={issue.assignee.fullName} />
              <AvatarFallback>{getInitials(issue.assignee.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{issue.assignee.fullName}</p>
              <p className="text-sm text-muted-foreground">{issue.assignee.email}</p>
            </div>
          </div>
          <div className="space-x-2">
            <Badge>{issue.priority}</Badge>
            <Badge>{issue.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
