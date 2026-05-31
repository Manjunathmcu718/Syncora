const STORAGE_KEY = "taskflow.fake.tasks";

const seedTasks = [
  ["task-001", "Finalize dashboard layout", "Polish the project board spacing, empty states, and responsive behavior.", "in_progress", "high", "2026-06-02"],
  ["task-002", "Create onboarding checklist", "Define the first-run checklist for new workspace users.", "todo", "medium", "2026-06-04"],
  ["task-003", "Review API error messages", "Make validation and server error messages clearer across task endpoints.", "todo", "high", "2026-06-01"],
  ["task-004", "Add search result highlighting", "Highlight matching text in task titles and descriptions.", "todo", "low", "2026-06-09"],
  ["task-005", "Prepare sprint notes", "Collect shipped work, blockers, and next priorities for the sprint review.", "completed", "medium", "2026-05-28"],
  ["task-006", "Tune drag and drop feedback", "Improve hover states and column drop indicators while moving cards.", "in_progress", "medium", "2026-06-03"],
  ["task-007", "Write task CRUD tests", "Cover create, update, delete, and not-found cases for the task API.", "todo", "high", "2026-06-07"],
  ["task-008", "Update README setup steps", "Document local frontend and backend startup commands.", "completed", "low", "2026-05-24"],
  ["task-009", "Design notification preferences", "Sketch settings for due date reminders and activity updates.", "todo", "medium", "2026-06-12"],
  ["task-010", "Fix overdue badge count", "Verify overdue logic around local dates and completed tasks.", "in_progress", "high", "2026-05-30"],
  ["task-011", "Refine task form validation", "Prevent blank titles and normalize optional due dates.", "todo", "medium", "2026-06-05"],
  ["task-012", "Archive finished prototype notes", "Move old prototype notes into the completed project folder.", "completed", "low", "2026-05-22"],
  ["task-013", "Add priority filter analytics", "Track how often users filter by high, medium, and low priority.", "todo", "low", "2026-06-15"],
  ["task-014", "Confirm deployment env vars", "Check API URL, frontend URL, and production CORS settings.", "todo", "high", "2026-06-06"],
  ["task-015", "Clean completed card styling", "Make completed tasks readable while still clearly marked as done.", "in_progress", "medium", "2026-06-08"],
  ["task-016", "Schedule stakeholder demo", "Pick a time and prepare a short walkthrough of the board workflow.", "todo", "medium", "2026-06-10"],
  ["task-017", "Audit keyboard navigation", "Check tab order and focus visibility across dialogs and controls.", "todo", "high", "2026-06-11"],
  ["task-018", "Export board snapshot", "Add a lightweight CSV export for current task filters.", "todo", "low", "2026-06-18"],
  ["task-019", "Resolve mobile header spacing", "Keep the create button and notifications from crowding smaller screens.", "completed", "medium", "2026-05-29"],
  ["task-020", "Draft empty workspace state", "Design the view shown before a user creates their first task.", "completed", "low", "2026-05-27"],
  ["task-021", "Investigate slow first load", "Profile bundle size and identify obvious loading bottlenecks.", "in_progress", "high", "2026-06-04"],
  ["task-022", "Collect beta feedback", "Summarize feedback from the first beta users into actionable tasks.", "todo", "medium", "2026-06-14"],
].map(([id, title, description, status, priority, due_date], index) => {
  const createdAt = new Date(Date.UTC(2026, 4, 20, 9, index * 10)).toISOString();
  return {
    id,
    title,
    description,
    status,
    priority,
    due_date,
    created_at: createdAt,
    updated_at: createdAt,
  };
});

const sortByCreatedAtDesc = (tasks) =>
  [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const readTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
  return seedTasks;
};

const writeTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return tasks;
};

const notFound = () => new Error("Task not found");

export const fakeTasksApi = {
  getAll: async () => sortByCreatedAtDesc(readTasks()),
  getById: async (id) => {
    const task = readTasks().find((item) => item.id === id);
    if (!task) throw notFound();
    return task;
  },
  create: async (data) => {
    const tasks = readTasks();
    const now = new Date().toISOString();
    const nextNumber = tasks.reduce((max, task) => {
      const match = String(task.id).match(/^task-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;
    const task = {
      id: `task-${String(nextNumber).padStart(3, "0")}`,
      title: data.title,
      description: data.description || "",
      status: data.status || "todo",
      priority: data.priority || "medium",
      due_date: data.due_date || null,
      created_at: now,
      updated_at: now,
    };

    writeTasks([task, ...tasks]);
    return task;
  },
  update: async (id, data) => {
    const tasks = readTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) throw notFound();

    const updated = {
      ...tasks[index],
      ...data,
      due_date: data.due_date === "" ? null : data.due_date ?? tasks[index].due_date,
      updated_at: new Date().toISOString(),
    };
    tasks[index] = updated;
    writeTasks(tasks);
    return updated;
  },
  delete: async (id) => {
    const tasks = readTasks();
    if (!tasks.some((task) => task.id === id)) throw notFound();

    writeTasks(tasks.filter((task) => task.id !== id));
    return { message: "Task deleted successfully" };
  },
};
