"use client";

import { useState } from "react";
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
import { PlusCircle, Share2, Clock, MapPin, BookOpen } from "lucide-react";

const daysOfWeek: ClassItem["day"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const classSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  day: z.enum(daysOfWeek),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  location: z.string().optional(),
});

export function SchedulePageClient({
  initialSchedule,
}: {
  initialSchedule: ClassItem[];
}) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      subject: "",
      day: "Monday",
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
    toast({ title: "Success", description: "Class added to your schedule." });
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleShare = () => {
    let shareText = "My Weekly Schedule:\n\n";
    daysOfWeek.forEach(day => {
        const classesForDay = schedule.filter(c => c.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
        if(classesForDay.length > 0) {
            shareText += `${day}:\n`;
            classesForDay.forEach(c => {
                shareText += `  - ${c.startTime}-${c.endTime}: ${c.subject}${c.location ? ` at ${c.location}`: ''}\n`;
            });
            shareText += '\n';
        }
    });

    navigator.clipboard.writeText(shareText);
    toast({
        title: "Schedule Copied!",
        description: "Your schedule has been copied to the clipboard.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleShare}><Share2 /> Share Schedule</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <PlusCircle /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Class</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Calculus II" {...field} />
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
                      <FormLabel>Day of the Week</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
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
                        <FormLabel>Start Time</FormLabel>
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
                        <FormLabel>End Time</FormLabel>
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
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Science Hall 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Class</Button>
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
                    <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
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
                    </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
