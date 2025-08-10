import type { Task, ClassItem } from '@/types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Completar tarea de Matemáticas 5',
    description: 'Problemas 1-10 de la página 56.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: 'Tarea',
  },
  {
    id: '2',
    title: 'Estudiar para el parcial de Química',
    description: 'Capítulos 4-6.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: 'Examen',
  },
  {
    id: '3',
    title: 'Entregar borrador de ensayo de Historia',
    description: 'Tema: El Renacimiento.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'Tarea',
  },
    {
    id: '4',
    title: 'Reunión de proyecto en grupo',
    description: 'Finalizar diapositivas de la presentación.',
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    type: 'Recordatorio',
  },
];

export const schedule: ClassItem[] = [
  {
    id: 'cl1',
    subject: 'Cálculo II',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Edificio de Matemáticas 210',
  },
  {
    id: 'cl2',
    subject: 'Introducción a la Física',
    day: 'Monday',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Salón de Ciencias 101',
  },
   {
    id: 'cl3',
    subject: 'Historia Mundial',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Humanidades 305',
  },
    {
    id: 'cl4',
    subject: 'Cálculo II',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Edificio de Matemáticas 210',
  },
    {
    id: 'cl5',
    subject: 'Laboratorio de Química',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Laboratorio de Química 3',
  },
  {
    id: 'cl6',
    subject: 'Introducción a la Física',
    day: 'Friday',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Salón de Ciencias 101',
  },
];
