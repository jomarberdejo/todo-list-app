
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { formatDate } from "../utils/formatDate";
import { useTodoActions } from "../hooks/useTodoActions";
import type { Todo } from "@/types/todos";
import { EditTodoDialog } from "./EditTodo";

interface Props {
  data: Todo[];
  onRefresh: () => void;
}

export const TodoTable = ({ data, onRefresh }: Props) => {
  const { toggleStatus, deleteTodo, updateTodo } = useTodoActions(onRefresh);

  const [editTodo, setEditTodo] = React.useState<Todo | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const openEdit = (todo: Todo) => {
    setEditTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
  };

  const saveEdit = async () => {
    if (!editTodo) return;
    await updateTodo(editTodo.id, title, description);
    setEditTodo(null);
  };

  const filteredData = React.useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((todo) => todo.status === statusFilter);
  }, [data, statusFilter]);

  const columns = React.useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        accessorKey: "title",
        header: () => <span className="cursor-pointer">Title</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) =>
          row.original.dueDate ? formatDate(row.original.dueDate) : "",
      },
      {
        accessorKey: "status",
        header: "Done",
        cell: ({ row }) => (
          <Switch
            checked={row.original.status === "COMPLETED"}
            onCheckedChange={() => toggleStatus(row.original)}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteTodo(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), 
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Input
          placeholder="Search todos..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="md:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <p className="mb-2 text-sm text-gray-500">
        Click on the table headers to sort.
      </p>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No todos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>

      <EditTodoDialog
        todo={editTodo}
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        onClose={() => setEditTodo(null)}
        onSave={saveEdit}
      />
    </>
  );
};
