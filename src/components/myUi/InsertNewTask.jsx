import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export function InsertNewTask({fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSaveTask = async (e) => {
    // e.preventDefault();

    // Check if all fields are filled
    if (!title || !description || !priority || !status) {
      toast.error("All fields must be filled");
      return;
    }

    const taskData = {
      title,
      description,
      priority,
      status,
    };

    // POST request to save the task
    const promise = new Promise((resolve, reject) => {
      fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => {
          if (response.ok) {
            resolve({ name: "Task" });
          } else {
            reject("Failed to create task");
          }
        })
        .catch((error) => {
          reject(error.message || "Something went wrong");
        });
    });

    // Toast message for loading, success, or error
    toast.promise(promise, {
      loading: "Saving task...",
      success: (data) => `${data.name} has been created successfully!`,
      error: (error) => `Error: ${error}`,
    });

    // Reset fields after operation
    setTitle("");
    setDescription("");
    setPriority("");
    setStatus("");
    if(fetchTasks) {
      setTimeout(() => fetchTasks(), 1000);
    }
  };
  if (!isHydrated) {
    return null; // Or some fallback
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {(
          <Button>
            <span className="mr-2">+</span> Add Task
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Task</SheetTitle>
          <SheetDescription>
            Add a new task to your to-do list by filling out the fields below.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSaveTask} className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Task Title
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
              className="col-span-2"
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
              className="col-span-2"
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        {/* Footer with Save Button */}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSaveTask}>
              Save Task
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
