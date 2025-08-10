import type { Task, ClassItem } from '@/types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Complete Math Homework 5',
    description: 'Problems 1-10 on page 56.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: 'Task',
  },
  {
    id: '2',
    title: 'Study for Chemistry Midterm',
    description: 'Chapters 4-6.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: 'Exam',
  },
  {
    id: '3',
    title: 'Submit History Essay Draft',
    description: 'Topic: The Renaissance.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'Task',
  },
    {
    id: '4',
    title: 'Group project meeting',
    description: 'Finalize presentation slides.',
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    type: 'Reminder',
  },
];

export const schedule: ClassItem[] = [
  {
    id: 'cl1',
    subject: 'Calculus II',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Math Building 210',
  },
  {
    id: 'cl2',
    subject: 'Introduction to Physics',
    day: 'Monday',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Science Hall 101',
  },
   {
    id: 'cl3',
    subject: 'World History',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Humanities 305',
  },
    {
    id: 'cl4',
    subject: 'Calculus II',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Math Building 210',
  },
    {
    id: 'cl5',
    subject: 'Chemistry Lab',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Chem Lab 3',
  },
  {
    id: 'cl6',
    subject: 'Introduction to Physics',
    day: 'Friday',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Science Hall 101',
  },
];
