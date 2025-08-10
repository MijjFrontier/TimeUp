"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, PlusCircle, Share2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";

const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  dueDate: z.date({
    required_error: "Se requiere una fecha de entrega.",
  }),
  type: z.enum(["Tarea", "Examen", "Recordatorio"]),
  description: z.string().optional(),
});

export function TasksPageClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        try {
            const storedTasks = localStorage.getItem("tasks");
            if (storedTasks) {
                // When retrieving from localStorage, dates are strings, so we need to convert them back to Date objects
                const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
                    ...task,
                    dueDate: new Date(task.dueDate) 
                }));
                setTasks(parsedTasks);
            } else {
                setTasks(initialTasks);
            }
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
            setTasks(initialTasks);
        }
    }
  }, [isClient, initialTasks]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      type: "Tarea",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    const newTask: Task = {
      id: Date.now().toString(),
      ...values,
    };
    setTasks([newTask, ...tasks]);
    toast({
      title: "¡Tarea creada!",
      description: `"${values.title}" ha sido añadida a tu lista.`,
    });
    setIsDialogOpen(false);
    form.reset();
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: "Tarea eliminada", description: "La tarea ha sido eliminada de tu lista." });
  }
  
  const handleShare = () => {
    const sortedTasks = [...tasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    let shareText = "Mis Tareas y Fechas de Entrega:\n\n";
    sortedTasks.forEach(task => {
        shareText += `- [${task.type}] ${task.title} - Fecha de entrega: ${format(task.dueDate, "PPP", { locale: es })}\n`;
    });
    navigator.clipboard.writeText(shareText);
    toast({
        title: "¡Tareas Copiadas!",
        description: "Tu lista de tareas ha sido copiada al portapapeles.",
    });
  }

  const getTaskBadgeVariant = (type: string) => {
    switch (type) {
      case "Examen": return "destructive";
      case "Tarea": return "default";
      case "Recordatorio": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleShare}><Share2 /> Compartir Tareas</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                <PlusCircle /> Añadir Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir un nuevo item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Leer capítulo 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de item" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tarea">Tarea</SelectItem>
                          <SelectItem value="Examen">Examen</SelectItem>
                          <SelectItem value="Recordatorio">Recordatorio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Añade más detalles..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                    <Button type="submit">Añadir Item</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={getTaskBadgeVariant(task.type)}>{task.type}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(task.dueDate), "PPP", { locale: es })}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {task.description || "-"}
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar tarea</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron tareas. ¡Añade una para empezar!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
