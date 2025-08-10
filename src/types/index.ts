export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: 'Tarea' | 'Examen' | 'Recordatorio';
};

export type ClassItem = {
  id: string;
  subject: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  location?: string;
};
