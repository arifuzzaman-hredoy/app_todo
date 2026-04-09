"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string;
  createdAt: string;
  updatedAt: string;
};

const priorityOptions: Priority[] = ["LOW", "MEDIUM", "HIGH"];

function formatDate(date?: string | null) {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function parseTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("MEDIUM");
  const [editTags, setEditTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const overdueCount = useMemo(
    () =>
      todos.filter(
        (todo) =>
          todo.dueDate &&
          !todo.completed &&
          new Date(todo.dueDate) < new Date()
      ).length,
    [todos]
  );

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === "ACTIVE") return !todo.completed;
        if (filter === "COMPLETED") return todo.completed;
        return true;
      })
      .filter((todo) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          todo.title.toLowerCase().includes(query) ||
          todo.description.toLowerCase().includes(query) ||
          todo.tags.toLowerCase().includes(query)
        );
      });
  }, [todos, filter, search]);

  async function loadTodos() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Unable to load todos.");
      const data = (await res.json()) as Todo[];
      setTodos(data);
    } catch (err) {
      setError((err as Error).message || "Failed to load todos.");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate: dueDate || null,
          tags: parseTags(tags),
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || "Could not create todo.");
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setTags("");
      await loadTodos();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditDueDate(todo.dueDate ?? "");
    setEditPriority(todo.priority);
    setEditTags(todo.tags);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function saveEdit(id: number) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
          dueDate: editDueDate || null,
          tags: parseTags(editTags),
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || "Could not update todo.");
      }

      await loadTodos();
      cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, completed: boolean) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Could not update status.");
      await loadTodos();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTodo(id: number) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete todo.");
      await loadTodos();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Advanced Todo Manager</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                Track tasks, deadlines, and priorities in one place
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Create todos, search them, filter by status, edit details, and save everything with Prisma.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Total</p>
                <p className="mt-3 text-3xl font-semibold">{todos.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Completed</p>
                <p className="mt-3 text-3xl font-semibold">{completedCount}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Overdue</p>
                <p className="mt-3 text-3xl font-semibold">{overdueCount}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Add a new task</h2>
            <form className="mt-6 space-y-5" onSubmit={addTodo}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Task title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="Finish the migration"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="Add any additional details..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Due date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Priority)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="Separate tags with commas"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Add tasks that will save to your database.</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? "Saving..." : "Save task"}
                </button>
              </div>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Search & filters</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="Search title, description, or tags"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Show tasks</p>
                <div className="flex flex-wrap gap-2">
                  {(["ALL", "ACTIVE", "COMPLETED"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFilter(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        filter === option
                          ? "bg-sky-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Task list</h2>
              <p className="mt-2 text-sm text-slate-500">Showing {filteredTodos.length} of {todos.length} tasks.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{loading ? "Loading..." : "Ready to manage tasks"}</div>
          </div>

          <div className="grid gap-4">
            {filteredTodos.map((todo) => (
              <article
                key={todo.id}
                className={`rounded-3xl border p-5 transition ${
                  todo.completed ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xl font-semibold text-slate-900">{todo.title}</span>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {todo.priority}
                      </span>
                      {todo.completed ? (
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Completed</span>
                      ) : null}
                    </div>
                    <p className="text-slate-600">{todo.description || "No description added."}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>Due: {formatDate(todo.dueDate)}</span>
                      <span>Created: {formatDate(todo.createdAt)}</span>
                    </div>
                    {todo.tags ? (
                      <div className="flex flex-wrap gap-2">
                        {parseTags(todo.tags).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(todo.id, !todo.completed)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      {todo.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => beginEdit(todo)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === todo.id ? (
                  <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit task</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                        <input
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                        <select
                          value={editPriority}
                          onChange={(event) => setEditPriority(event.target.value as Priority)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        >
                          {priorityOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                          value={editDescription}
                          onChange={(event) => setEditDescription(event.target.value)}
                          rows={3}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Due date</label>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(event) => setEditDueDate(event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
                        <input
                          value={editTags}
                          onChange={(event) => setEditTags(event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                          placeholder="Separate tags with commas"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => saveEdit(todo.id)}
                        className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
