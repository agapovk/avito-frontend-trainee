import { Issue } from '@/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { statusMap } from '@/lib/utils';

export default function IssueCard({ issue }: { issue: Issue }) {
  const getInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join('');
  };

  return (
    <Card className="p-0">
      <CardContent className="py-4">
        <p className="font-semibold px-0 text-md truncate">{issue.title}</p>
        <p className="text-muted-foreground text-sm truncate">{issue.boardName}</p>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mt-4 gap-2">
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
            <Badge variant="outline">{issue.priority}</Badge>
            <Badge
              variant="outline"
              className={statusMap[issue.status as keyof typeof statusMap].color}
            >
              {statusMap[issue.status as keyof typeof statusMap].title}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
