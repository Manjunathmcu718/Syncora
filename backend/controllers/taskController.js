const { validationResult } = require("express-validator");

let tasks = [
  {
    id: "task-001",
    title: "Finalize dashboard layout",
    description: "Polish the project board spacing, empty states, and responsive behavior.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-06-02",
    created_at: "2026-05-20T09:00:00.000Z",
    updated_at: "2026-05-29T11:20:00.000Z",
  },
  {
    id: "task-002",
    title: "Create onboarding checklist",
    description: "Define the first-run checklist for new workspace users.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-04",
    created_at: "2026-05-20T09:10:00.000Z",
    updated_at: "2026-05-20T09:10:00.000Z",
  },
  {
    id: "task-003",
    title: "Review API error messages",
    description: "Make validation and server error messages clearer across task endpoints.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-01",
    created_at: "2026-05-20T09:20:00.000Z",
    updated_at: "2026-05-25T13:35:00.000Z",
  },
  {
    id: "task-004",
    title: "Add search result highlighting",
    description: "Highlight matching text in task titles and descriptions.",
    status: "todo",
    priority: "low",
    due_date: "2026-06-09",
    created_at: "2026-05-20T09:30:00.000Z",
    updated_at: "2026-05-20T09:30:00.000Z",
  },
  {
    id: "task-005",
    title: "Prepare sprint notes",
    description: "Collect shipped work, blockers, and next priorities for the sprint review.",
    status: "completed",
    priority: "medium",
    due_date: "2026-05-28",
    created_at: "2026-05-20T09:40:00.000Z",
    updated_at: "2026-05-28T17:05:00.000Z",
  },
  {
    id: "task-006",
    title: "Tune drag and drop feedback",
    description: "Improve hover states and column drop indicators while moving cards.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-06-03",
    created_at: "2026-05-20T09:50:00.000Z",
    updated_at: "2026-05-30T08:10:00.000Z",
  },
  {
    id: "task-007",
    title: "Write task CRUD tests",
    description: "Cover create, update, delete, and not-found cases for the task API.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-07",
    created_at: "2026-05-20T10:00:00.000Z",
    updated_at: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "task-008",
    title: "Update README setup steps",
    description: "Document local frontend and backend startup commands.",
    status: "completed",
    priority: "low",
    due_date: "2026-05-24",
    created_at: "2026-05-20T10:10:00.000Z",
    updated_at: "2026-05-24T14:40:00.000Z",
  },
  {
    id: "task-009",
    title: "Design notification preferences",
    description: "Sketch settings for due date reminders and activity updates.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-12",
    created_at: "2026-05-20T10:20:00.000Z",
    updated_at: "2026-05-20T10:20:00.000Z",
  },
  {
    id: "task-010",
    title: "Fix overdue badge count",
    description: "Verify overdue logic around local dates and completed tasks.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-05-30",
    created_at: "2026-05-20T10:30:00.000Z",
    updated_at: "2026-05-31T07:15:00.000Z",
  },
  {
    id: "task-011",
    title: "Refine task form validation",
    description: "Prevent blank titles and normalize optional due dates.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-05",
    created_at: "2026-05-20T10:40:00.000Z",
    updated_at: "2026-05-20T10:40:00.000Z",
  },
  {
    id: "task-012",
    title: "Archive finished prototype notes",
    description: "Move old prototype notes into the completed project folder.",
    status: "completed",
    priority: "low",
    due_date: "2026-05-22",
    created_at: "2026-05-20T10:50:00.000Z",
    updated_at: "2026-05-22T12:30:00.000Z",
  },
  {
    id: "task-013",
    title: "Add priority filter analytics",
    description: "Track how often users filter by high, medium, and low priority.",
    status: "todo",
    priority: "low",
    due_date: "2026-06-15",
    created_at: "2026-05-20T11:00:00.000Z",
    updated_at: "2026-05-20T11:00:00.000Z",
  },
  {
    id: "task-014",
    title: "Confirm deployment env vars",
    description: "Check API URL, frontend URL, and production CORS settings.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-06",
    created_at: "2026-05-20T11:10:00.000Z",
    updated_at: "2026-05-26T09:45:00.000Z",
  },
  {
    id: "task-015",
    title: "Clean completed card styling",
    description: "Make completed tasks readable while still clearly marked as done.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-06-08",
    created_at: "2026-05-20T11:20:00.000Z",
    updated_at: "2026-05-29T18:25:00.000Z",
  },
  {
    id: "task-016",
    title: "Schedule stakeholder demo",
    description: "Pick a time and prepare a short walkthrough of the board workflow.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-10",
    created_at: "2026-05-20T11:30:00.000Z",
    updated_at: "2026-05-20T11:30:00.000Z",
  },
  {
    id: "task-017",
    title: "Audit keyboard navigation",
    description: "Check tab order and focus visibility across dialogs and controls.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-11",
    created_at: "2026-05-20T11:40:00.000Z",
    updated_at: "2026-05-20T11:40:00.000Z",
  },
  {
    id: "task-018",
    title: "Export board snapshot",
    description: "Add a lightweight CSV export for current task filters.",
    status: "todo",
    priority: "low",
    due_date: "2026-06-18",
    created_at: "2026-05-20T11:50:00.000Z",
    updated_at: "2026-05-20T11:50:00.000Z",
  },
  {
    id: "task-019",
    title: "Resolve mobile header spacing",
    description: "Keep the create button and notifications from crowding smaller screens.",
    status: "completed",
    priority: "medium",
    due_date: "2026-05-29",
    created_at: "2026-05-20T12:00:00.000Z",
    updated_at: "2026-05-29T16:10:00.000Z",
  },
  {
    id: "task-020",
    title: "Draft empty workspace state",
    description: "Design the view shown before a user creates their first task.",
    status: "completed",
    priority: "low",
    due_date: "2026-05-27",
    created_at: "2026-05-20T12:10:00.000Z",
    updated_at: "2026-05-27T10:20:00.000Z",
  },
  {
    id: "task-021",
    title: "Investigate slow first load",
    description: "Profile bundle size and identify obvious loading bottlenecks.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-06-04",
    created_at: "2026-05-20T12:20:00.000Z",
    updated_at: "2026-05-31T05:35:00.000Z",
  },
  {
    id: "task-022",
    title: "Collect beta feedback",
    description: "Summarize feedback from the first beta users into actionable tasks.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-14",
    created_at: "2026-05-20T12:30:00.000Z",
    updated_at: "2026-05-20T12:30:00.000Z",
  },
];

let nextId = 23;

const orderByCreatedAtDesc = (items) =>
  [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const findTaskIndex = (id) => tasks.findIndex((task) => task.id === id);

const createNotFoundError = () => {
  const err = new Error("Task not found");
  err.statusCode = 404;
  return err;
};

const getAllTasks = async (req, res, next) => {
  try {
    res.json({ success: true, data: orderByCreatedAtDesc(tasks) });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const data = tasks.find((task) => task.id === req.params.id);

    if (!data) throw createNotFoundError();

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, status, priority, due_date } = req.body;
    const now = new Date().toISOString();
    const data = {
      id: `task-${String(nextId).padStart(3, "0")}`,
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      due_date: due_date || null,
      created_at: now,
      updated_at: now,
    };

    nextId += 1;
    tasks = [data, ...tasks];

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, status, priority, due_date } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (due_date !== undefined) updates.due_date = due_date || null;

    const taskIndex = findTaskIndex(req.params.id);
    if (taskIndex === -1) throw createNotFoundError();

    const data = {
      ...tasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    tasks[taskIndex] = data;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskIndex = findTaskIndex(req.params.id);
    if (taskIndex === -1) throw createNotFoundError();

    tasks = tasks.filter((task) => task.id !== req.params.id);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
