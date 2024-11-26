import { useState, useEffect } from "react";
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
import { Pen } from "lucide-react";

// EditTaskDetails component now accepts the task object as a prop
export function EditTaskDetails({ task, fetchTasks }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [status, setStatus] = useState(task?.status || "");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Set form fields when task prop changes (useful for edit mode)
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  const handleSaveTask = async (e) => {

    // Check if all fields are filled
    if (!title || !description || !priority || !status) {
      toast.error("All fields must be filled");
      return;
    }

    const updatedTask = {
      title,
      description,
      priority,
      status,
    };

    // PUT request to update the task
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/tasks/${task._id}`, {  // Using the task's id for the PUT request
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
        .then((response) => {
          if (response.ok) {
            resolve({ name: "Task" });
          } else {
            reject("Failed to update task");
          }
        })
        .catch((error) => {
          reject(error.message || "Something went wrong");
        });
    });

    // Toast message for loading, success, or error
    toast.promise(promise, {
      loading: "Saving task...",
      success: (data) => `${data.name} has been updated successfully!`,
      error: (error) => `Error: ${error}`,
    });

    // Reset fields after operation if needed
    setTitle("");
    setDescription("");
    setPriority("");
    setStatus("");

    // Call the onSave function if provided (could be for updating local state or closing modal)
    if (fetchTasks){
        setTimeout(() => fetchTasks(), 1000);
        console.log("fetchTasks called");
    }
    else console.log("No onSave function provided");
  };
  if (!isHydrated) {
    return null; // Or some fallback
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className='bg-inherit hover:inherit shadow-none border-none hover:border-none'>
          <Pen size={'10px'}></Pen>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit task details</SheetTitle>
          <SheetDescription>
            Edit the details of the selected task
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
