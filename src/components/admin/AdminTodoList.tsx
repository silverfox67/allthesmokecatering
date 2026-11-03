"use client";

import React, { useState, useEffect } from "react";
import { AdminTheme } from "./AdminPortal";

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: "SEO" | "AI Search" | "Security & Speed" | "Conversion CRO" | "Menu & Pricing" | "Pitmaster General";
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  createdAt: string;
}

const INITIAL_TODOS: TodoItem[] = [
  {
    id: "todo-1",
    title: "Sitemap Cleanup & Page Inclusion",
    description: "Remove URL hash fragments (#packages, #reels) from sitemap.ts so Google/Bing don't flag them, and add first-class index entries for /gallery (Priority: 0.9) and /specials (Priority: 0.8).",
    category: "SEO",
    priority: "High",
    completed: false,
    createdAt: "Nov 2, 2026",
  },
  {
    id: "todo-2",
    title: "Deploy public/llms.txt for AI Search Engines",
    description: "Provide structured markdown documentation for ChatGPT Search, Perplexity, Claude, and Google AI Overviews detailing signature meats, $150 delivery minimum, trailer rig specs, and direct booking instructions.",
    category: "AI Search",
    priority: "High",
    completed: false,
    createdAt: "Nov 2, 2026",
  },
  {
    id: "todo-3",
    title: "Edge Caching & Strict-Transport-Security (HSTS)",
    description: "Add 1-year immutable caching for /audio/* and /videos/* in public/_headers, and add Strict-Transport-Security (HSTS) for A+ SSL security score on Cloudflare Pages.",
    category: "Security & Speed",
    priority: "Medium",
    completed: false,
    createdAt: "Nov 2, 2026",
  },
  {
    id: "todo-4",
    title: "1-Tap Mobile Autofill on Quote Inputs",
    description: "Add autoComplete='name', autoComplete='email', autoComplete='tel', and autoComplete='street-address' to QuoteModal and ContactSection so corporate event planners can submit quotes in under 15 seconds.",
    category: "Conversion CRO",
    priority: "Medium",
    completed: false,
    createdAt: "Nov 2, 2026",
  },
];

interface AdminTodoListProps {
  theme: AdminTheme;
}

export function AdminTodoList({ theme }: AdminTodoListProps) {
  const isDay = theme === "day";
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<TodoItem["category"]>("Pitmaster General");
  const [newPriority, setNewPriority] = useState<TodoItem["priority"]>("Medium");

  // Load saved todos from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats_admin_todos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTodos(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse saved todos:", e);
        }
      }
    }
  }, []);

  // Save todos to localStorage on change
  const saveTodos = (updated: TodoItem[]) => {
    setTodos(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_admin_todos", JSON.stringify(updated));
    }
  };

  const toggleComplete = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    saveTodos([newTodo, ...todos]);
    setNewTitle("");
    setNewDesc("");
    setIsAdding(false);
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                isDay ? "text-stone-900" : "text-white"
              }`}
            >
              Production To-Do &amp; Client Roadmap
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF8C38]">
              {pendingCount} Pending
            </span>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDay ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Track technical optimizations, client requests, and post-meeting action items before final sign-off.
          </p>
        </div>

        {/* Add Item Button */}
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>{isAdding ? "✕ Close Form" : "+ Add New Item"}</span>
        </button>
      </div>

      {/* Add New Item Modal / Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAddTodo}
          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
            isDay
              ? "bg-white border-stone-300 shadow-sm"
              : "bg-zinc-950/80 border-amber-500/30 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3
              className={`font-display text-sm font-bold uppercase tracking-wider ${
                isDay ? "text-stone-900" : "text-amber-400"
              }`}
            >
              New Client / Technical Action Item
            </h3>
            <span className="text-[11px] text-zinc-500">Press Save to add to queue</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Marion wants to add Turkey Leg add-on..."
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900 focus:border-[#EA580C]"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TodoItem["category"])}
                  className={`w-full px-2.5 py-2 rounded-xl text-xs border outline-none ${
                    isDay
                      ? "bg-stone-50 border-stone-300 text-stone-900"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                >
                  <option value="Menu & Pricing">Menu &amp; Pricing</option>
                  <option value="Pitmaster General">Pitmaster General</option>
                  <option value="SEO">SEO</option>
                  <option value="AI Search">AI Search</option>
                  <option value="Security & Speed">Security &amp; Speed</option>
                  <option value="Conversion CRO">Conversion CRO</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TodoItem["priority"])}
                  className={`w-full px-2.5 py-2 rounded-xl text-xs border outline-none ${
                    isDay
                      ? "bg-stone-50 border-stone-300 text-stone-900"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Description &amp; Specifications (Optional)
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Additional notes, client instructions, or links..."
              className={`w-full px-3 py-2 rounded-xl text-xs border outline-none resize-none transition-all ${
                isDay
                  ? "bg-stone-50 border-stone-300 text-stone-900 focus:border-[#EA580C]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Save to Backlog
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-[#EA580C] text-white"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          All Items ({todos.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "pending"
              ? "bg-[#EA580C] text-white"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "completed"
              ? "bg-[#EA580C] text-white"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div
            className={`p-8 rounded-2xl border text-center ${
              isDay
                ? "bg-white border-stone-200 text-stone-500"
                : "bg-zinc-950/60 border-zinc-800 text-zinc-500"
            }`}
          >
            <p className="text-sm font-semibold">No items match this filter.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isCompleted = todo.completed;

            return (
              <div
                key={todo.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  isCompleted
                    ? isDay
                      ? "bg-stone-100/60 border-stone-200 opacity-60"
                      : "bg-zinc-950/40 border-zinc-900 opacity-60"
                    : isDay
                    ? "bg-white border-stone-300 shadow-sm hover:border-[#EA580C]"
                    : "bg-[#141210] border-amber-500/25 shadow-md hover:border-amber-500/50"
                }`}
              >
                {/* Checkbox and Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all border ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isDay
                        ? "border-stone-400 hover:border-[#EA580C] bg-stone-50"
                        : "border-zinc-700 hover:border-amber-500 bg-zinc-900"
                    }`}
                    aria-label={isCompleted ? "Mark pending" : "Mark completed"}
                  >
                    {isCompleted && (
                      <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight ${
                          isCompleted
                            ? "line-through text-zinc-500"
                            : isDay
                            ? "text-stone-900"
                            : "text-white"
                        }`}
                      >
                        {todo.title}
                      </h4>

                      {/* Category Pill */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          todo.category === "SEO"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : todo.category === "AI Search"
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                            : todo.category === "Security & Speed"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : todo.category === "Conversion CRO"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        }`}
                      >
                        {todo.category}
                      </span>

                      {/* Priority Pill */}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          todo.priority === "High"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : todo.priority === "Medium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {todo.priority} Priority
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isCompleted
                          ? "line-through text-zinc-600"
                          : isDay
                          ? "text-stone-600"
                          : "text-zinc-300"
                      }`}
                    >
                      {todo.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 pt-0.5">
                      <span>Logged: {todo.createdAt}</span>
                      {isCompleted && <span className="text-emerald-500 font-semibold">• Completed</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center justify-end gap-1 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleComplete(todo.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      isCompleted
                        ? "text-zinc-500 hover:text-zinc-300"
                        : "text-emerald-500 hover:bg-emerald-500/10"
                    }`}
                  >
                    {isCompleted ? "Re-open" : "Done ✓"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
