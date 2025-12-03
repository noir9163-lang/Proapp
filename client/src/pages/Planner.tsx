import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Plus, Check, Trash2, Tag, Bell } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useGamification } from "@/lib/gamification";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  tag: "Homework" | "Exam" | "Study" | "Project";
};

export default function Planner() {
  const { addCoins, addXp } = useGamification();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Math Homework - Chapter 5", date: new Date(), completed: false, tag: "Homework" },
    { id: "2", title: "History Presentation Prep", date: new Date(), completed: true, tag: "Project" },
    { id: "3", title: "Biology Quiz Revision", date: new Date(), completed: false, tag: "Study" },
  ]);

  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask) return;
    const task: Task = {
      id: Math.random().toString(),
      title: newTask,
      date: date || new Date(),
      completed: false,
      tag: "Study"
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          addCoins(15);
          addXp(20);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Homework": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Exam": return "bg-red-100 text-red-700 border-red-200";
      case "Study": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Project": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSetReminder = (id: string) => {
    alert("Reminder set for this task!");
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Smart Planner</h1>
          <p className="text-muted-foreground">Organize your academic life and earn rewards.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input 
                  placeholder="e.g. Calculus Chapter 3" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <div className="border rounded-md p-2">
                  <Calendar 
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-none"
                  />
                </div>
              </div>
              <Button onClick={handleAddTask} className="w-full">Add to Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1">
        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full flex justify-center"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-none shadow-none bg-transparent">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tasks for {date ? format(date, "MMMM do") : "Today"}</h2>
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list" className="space-y-3 mt-0">
              {tasks.filter(t => !date || t.date.getDate() === date.getDate()).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl">
                  <CalendarIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>No tasks for this day. Enjoy your free time!</p>
                </div>
              ) : (
                tasks
                  .filter(t => !date || t.date.getDate() === date.getDate())
                  .map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl border bg-card transition-all hover:shadow-md",
                      task.completed ? "opacity-60" : ""
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all",
                          task.completed 
                            ? "bg-green-500 border-green-500 scale-110" 
                            : "border-muted-foreground hover:border-primary"
                        )}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div>
                        <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", getTagColor(task.tag))}>
                            {task.tag}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due 5:00 PM
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleSetReminder(task.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this task?")) {
                            deleteTask(task.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="timeline">
              <div className="text-center p-10 text-muted-foreground">
                Timeline view coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
