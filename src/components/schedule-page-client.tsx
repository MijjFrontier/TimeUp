"use client";

import { useState, useEffect } from "react";
import type { ClassItem } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Share2, Clock, MapPin, BookOpen, Trash2 } from "lucide-react";

const daysOfWeek: ClassItem["day"][] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const classSchema = z.object({
  subject: z.string().min(1, "La materia es obligatoria"),
  day: z.enum(daysOfWeek, { required_error: "El día es obligatorio" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
  location: z.string().optional(),
});

export function SchedulePageClient({
  initialSchedule,
}: {
  initialSchedule: ClassItem[];
}) {
  const [schedule, setSchedule] = useState<ClassItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedSchedule = localStorage.getItem("schedule");
      if (storedSchedule) {
        setSchedule(JSON.parse(storedSchedule));
      } else {
        setSchedule(initialSchedule);
      }
    } catch (error) {
      console.error("Failed to parse schedule from localStorage", error);
      setSchedule(initialSchedule);
    }
  }, [initialSchedule]);

  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);
  

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      subject: "",
      day: "Lunes",
      startTime: "",
      endTime: "",
      location: "",
    },
  });

  const onSubmit = (values: z.infer<typeof classSchema>) => {
    const newClass: ClassItem = {
      id: Date.now().toString(),
      ...values,
    };
    setSchedule([...schedule, newClass]);
    toast({ title: "Éxito", description: "Clase añadida a tu horario." });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id));
    toast({ title: "Clase eliminada", description: "La clase ha sido eliminada de tu horario." });
  }
  
  const handleShare = () => {
    let shareText = "Mi Horario Semanal:\n\n";
    daysOfWeek.forEach(day => {
        const classesForDay = schedule.filter(c => c.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
        if(classesForDay.length > 0) {
            shareText += `${day}:\n`;
            classesForDay.forEach(c => {
                shareText += `  - ${c.startTime}-${c.endTime}: ${c.subject}${c.location ? ` en ${c.location}`: ''}\n`;
            });
            shareText += '\n';
        }
    });

    navigator.clipboard.writeText(shareText);
    toast({
        title: "¡Horario Copiado!",
        description: "Tu horario ha sido copiado al portapapeles.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleShare}><Share2 /> Compartir Horario</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <PlusCircle /> Añadir Clase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir una Nueva Clase</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materia</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cálculo II" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día de la Semana</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un día" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Inicio</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Fin</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Salón de Ciencias 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Añadir Clase</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {daysOfWeek.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-center">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[10rem]">
              {schedule
                .filter((c) => c.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((item) => (
                    <div key={item.id} className="relative group flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar clase</span>
                        </Button>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-semibold pr-6">{item.subject}</span>
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
                    </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
