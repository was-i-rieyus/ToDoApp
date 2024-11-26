"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "../ui/avatar";
import { InsertNewTask } from "./InsertNewTask";
import { EditTaskDetails } from "./EditTaskDetails";

const StatusBadge = ({ status }) => {
  const statusColors = {
    completed: "green",
    pending: "red",
  };

  return (
    <Badge className={`capitalize`}>
      {status.replace("-", " ")}
    </Badge>
  );
};

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "priority",
      header:"priority",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("priority")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div>
          <StatusBadge status={row.getValue("status")} />
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  markTaskCompleted(task._id); // Call the function when the menu item is clicked
                }}
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteTask(task._id); // Call the delete function when the item is clicked
                }}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "edit",
      cell: ({ row }) => {
        const task = row.original;

        return <EditTaskDetails task={task} fetchTasks={fetchTasks} />;
      },
    },
  ];

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks"); // Adjust the endpoint based on your backend API
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks"); // Adjust the endpoint based on your backend API
      const data = await response.json();
      console.log(data);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log(taskId);
      // Send DELETE request to delete the task from the database
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // On success, remove the task from the local state to update the UI
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );

        // Show success toast
        toast.success("Task deleted successfully!");
      } else {
        // Show error toast if deletion fails
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Show error toast if there's an issue with the request
      toast.error("Error deleting task");
    }
  };

  const markTaskCompleted = async (taskId) => {
    try {
      // Send PUT request to update the task's status to completed
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }), // Sending the updated status
      });

      if (response.ok) {
        // On success, show a success toast
        toast.success("Task marked as completed!");

        // Optionally, update the task status in the local state to reflect changes immediately
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: "completed" } : task
          )
        );
      } else {
        // Show an error toast if the request fails
        toast.error("Failed to mark task as completed");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      // Show an error toast if there is an issue with the request
      toast.error("Error marking task as completed");
    }
  };

  // Insert new task into backend
  const insertNewTask = async (newTask) => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      // After inserting, refetch the tasks to update the table
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error inserting task:", error);
    }
  };

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  if (!isHydrated) {
    return null; // Or some fallback
  }

  return (
    <div className="w-[70%]">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter tasks by title..."
          value={table.getColumn("title")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* ADD NEW TASK FUNCTIONALITY */}
        <InsertNewTask onInsert={insertNewTask} fetchTasks={fetchTasks}/>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  No tasks available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskTable;
