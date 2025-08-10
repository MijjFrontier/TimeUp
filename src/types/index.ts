export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: 'Task' | 'Exam' | 'Reminder';
};

export type ClassItem = {
  id: string;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  location?: string;
};
