import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { tasks, schedule } from "@/lib/data";
import { format } from 'date-fns';

export default function DashboardPage() {
  const upcomingTasks = tasks
    .filter(task => new Date(task.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  const todaysClasses = schedule.filter(c => c.day === today).sort((a,b) => a.startTime.localeCompare(b.startTime));

  const getTaskBadgeVariant = (type: string) => {
    switch (type) {
      case 'Exam': return 'destructive';
      case 'Task': return 'default';
      case 'Reminder': return 'secondary';
      default: return 'outline';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'Exam': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'Task': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'Reminder': return <Clock className="h-5 w-5 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 zoom-in-95">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Here are your most pressing tasks and exams.</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-4">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                   <div className="mt-1">
                      {getTaskIcon(task.type)}
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center">
                        <p className="font-semibold">{task.title}</p>
                        <Badge variant={getTaskBadgeVariant(task.type)} className="shrink-0">{task.type}</Badge>
                     </div>
                     <p className="text-sm text-muted-foreground">{format(task.dueDate, "EEEE, MMMM d")}</p>
                   </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming deadlines. Great job!</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your classes for {today}.</CardDescription>
        </CardHeader>
        <CardContent>
          {todaysClasses.length > 0 ? (
            <ul className="space-y-4">
              {todaysClasses.map(item => (
                <li key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                     <BookOpen className="h-4 w-4 text-primary" />
                     <span className="font-semibold">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No classes today. Enjoy your day off!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
