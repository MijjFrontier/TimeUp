import { tasks } from "@/lib/data";
import { TasksPageClient } from "@/components/tasks-page-client";

export default function TasksPage() {
  return <TasksPageClient initialTasks={tasks} />;
}
