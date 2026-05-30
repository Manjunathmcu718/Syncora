import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  LayoutDashboard,
  ListTodo,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import DeleteTaskDialog from "../components/DeleteTaskDialog";
import KanbanColumn from "../components/KanbanColumn";
import TaskFormDialog from "../components/TaskFormDialog";
import { useToast } from "../utils/toast";

const STORAGE_KEY = "taskflow_tasks";
const STAT_CONFIG = [
  { key: "total", label: "Total Tasks", icon: Zap, gradient: ["#7c3aed", "#4f46e5"], delay: 0.35 },
  { key: "todo", label: "To Do", icon: ListTodo, gradient: ["#3b82f6", "#6366f1"], delay: 0.45 },
  { key: "in_progress", label: "In Progress", icon: Clock, gradient: ["#f59e0b", "#ef4444"], delay: 0.55 },
  { key: "completed", label: "Completed", icon: CheckCircle2, gradient: ["#10b981", "#059669"], delay: 0.65 },
];
const FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];
const COLUMNS = ["todo", "in_progress", "completed"];
const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create wireframes and high-fidelity mockups for the redesigned homepage with hero section and feature highlights.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-06-05",
    created_date: "2026-05-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing, building, and deployment to production.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-10",
    created_date: "2026-05-21T09:00:00Z",
  },
  {
    id: "3",
    title: "Write unit tests for auth module",
    description: "Cover login, registration, password reset, and token refresh flows with Jest.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-08",
    created_date: "2026-05-22T08:30:00Z",
  },
  {
    id: "4",
    title: "Fix payment gateway bug",
    description: "Stripe webhook is not firing on subscription renewals. Investigate and patch the handler.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-05-31",
    created_date: "2026-05-23T11:00:00Z",
  },
  {
    id: "5",
    title: "Update API documentation",
    description: "Sync Swagger/OpenAPI docs with the latest endpoint changes from the v2.3 release.",
    status: "completed",
    priority: "low",
    due_date: "2026-05-28",
    created_date: "2026-05-18T14:00:00Z",
  },
  {
    id: "6",
    title: "Migrate database to PostgreSQL",
    description: "Move from SQLite to PostgreSQL for production scalability. Update ORM configs and run migrations.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-20",
    created_date: "2026-05-24T10:00:00Z",
  },
  {
    id: "7",
    title: "Implement dark mode toggle",
    description: "Add system-level dark/light mode detection with a manual toggle saved to localStorage.",
    status: "completed",
    priority: "medium",
    due_date: "2026-05-25",
    created_date: "2026-05-15T09:00:00Z",
  },
  {
    id: "8",
    title: "Optimize image loading",
    description: "Implement lazy loading, WebP conversion, and CDN caching for all product images.",
    status: "completed",
    priority: "medium",
    due_date: "2026-05-27",
    created_date: "2026-05-16T13:00:00Z",
  },
  {
    id: "9",
    title: "Conduct user interviews",
    description: "Schedule and run 5 user interviews to gather feedback on the new onboarding flow.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-06-03",
    created_date: "2026-05-25T10:00:00Z",
  },
  {
    id: "10",
    title: "Add multi-language support",
    description: "Integrate i18n library and add translations for English, Spanish, French, and Arabic.",
    status: "todo",
    priority: "low",
    due_date: "2026-07-01",
    created_date: "2026-05-26T08:00:00Z",
  },
  {
    id: "11",
    title: "Security audit & penetration testing",
    description: "Hire external security firm to perform full pentest on the API and admin dashboard.",
    status: "todo",
    priority: "high",
    due_date: "2026-06-15",
    created_date: "2026-05-27T09:00:00Z",
  },
  {
    id: "12",
    title: "Build admin analytics dashboard",
    description: "Create charts for DAU, revenue, churn rate, and user growth using Recharts.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-06-12",
    created_date: "2026-05-28T10:00:00Z",
  },
  {
    id: "13",
    title: "Refactor legacy cart logic",
    description: "Rewrite the shopping cart module using Zustand for cleaner state management.",
    status: "todo",
    priority: "medium",
    due_date: "2026-06-18",
    created_date: "2026-05-29T11:00:00Z",
  },
  {
    id: "14",
    title: "Email notification system",
    description: "Set up Resend for transactional emails - order confirmations, password resets, and weekly digests.",
    status: "completed",
    priority: "high",
    due_date: "2026-05-22",
    created_date: "2026-05-10T08:00:00Z",
  },
  {
    id: "15",
    title: "Mobile responsiveness fixes",
    description: "Fix layout breaking on screens below 375px - navbar overlap, card overflow, and form padding issues.",
    status: "completed",
    priority: "low",
    due_date: "2026-05-26",
    created_date: "2026-05-19T14:00:00Z",
  },
  {
    id: "16",
    title: "Q1 performance review report",
    description: "Compile team performance metrics and prepare the executive summary slide deck.",
    status: "todo",
    priority: "high",
    due_date: "2026-05-15",
    created_date: "2026-05-01T09:00:00Z",
  },
  {
    id: "17",
    title: "Update privacy policy",
    description: "Revise the privacy policy to comply with the new GDPR amendment requirements.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-05-20",
    created_date: "2026-05-05T10:00:00Z",
  },
];

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved) || saved.length === 0) return SAMPLE_TASKS;

    return saved.filter((task) => task && typeof task === "object").map((task) => ({
      id: String(task.id || genId()),
      title: typeof task.title === "string" ? task.title : "Untitled task",
      description: typeof task.description === "string" ? task.description : "",
      status: COLUMNS.includes(task.status) ? task.status : "todo",
      due_date: typeof task.due_date === "string" && !Number.isNaN(new Date(task.due_date).getTime()) ? task.due_date : "",
      priority: ["low", "medium", "high"].includes(task.priority) ? task.priority : "medium",
      created_date: task.created_date || new Date().toISOString(),
    }));
  } catch {
    return SAMPLE_TASKS;
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return val;
}

function StatCard({ label, value, icon: Icon, gradient, delay }) {
  const animated = useCountUp(value, 900);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 500, damping: 25 } }}
      className="group relative cursor-default overflow-hidden rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}18, ${gradient[1]}10)` }}
      />
      <div
        className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full opacity-[0.07] blur-2xl transition-all group-hover:opacity-[0.15]"
        style={{ background: `radial-gradient(circle, ${gradient[0]}, transparent)` }}
      />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <ChevronRight className="h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
        </div>
        <p className="text-3xl font-black tabular-nums text-white">{animated}</p>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(loadTasks);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => saveTasks(tasks), [tasks]);

  const counts = useMemo(() => {
    const overdue = tasks.filter(
      (t) => t.due_date && t.status !== "completed" && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)),
    ).length;

    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      overdue,
    };
  }, [tasks]);

  const filteredByCol = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searchFiltered = tasks.filter(
      (t) => !query || t.title?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query),
    );
    const filtered = activeFilter === "all" ? searchFiltered : searchFiltered.filter((t) => t.priority === activeFilter);

    return {
      todo: filtered.filter((t) => t.status === "todo"),
      in_progress: filtered.filter((t) => t.status === "in_progress"),
      completed: filtered.filter((t) => t.status === "completed"),
    };
  }, [activeFilter, search, tasks]);

  const pct = tasks.length > 0 ? Math.round((counts.completed / tasks.length) * 100) : 0;
  const circumference = 2 * Math.PI * 22;
  const today = format(new Date(), "EEEE, MMMM d");

  const createTask = (data) => {
    setTasks((prev) => [{ ...data, id: genId(), created_date: new Date().toISOString() }, ...prev]);
    setFormOpen(false);
    toast({ title: "Task created" });
  };

  const updateTask = (id, data) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...data } : task)));
    setFormOpen(false);
    setEditTask(null);
  };

  const handleDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTasks((prev) => prev.map((task) => (task.id === draggableId ? { ...task, status: destination.droppableId } : task)));
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] font-inter">
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative hidden w-64 shrink-0 flex-col overflow-hidden lg:flex"
        style={{ background: "linear-gradient(180deg,#13111c 0%,#0f0d1a 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-64"
          style={{ background: "radial-gradient(ellipse at 50% -20%,rgba(124,58,237,0.25),transparent 70%)" }}
        />
        <div className="relative z-10 flex items-center gap-3 px-6 py-7">
          <motion.div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <p className="text-base font-black leading-none text-white">TaskFlow</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Pro</p>
          </div>
        </div>

        <nav className="relative z-10 flex-1 px-3">
          <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Menu</p>
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ListTodo, label: "My Tasks" },
            { icon: CheckCircle2, label: "Completed" },
            { icon: AlertTriangle, label: "Overdue", badge: counts.overdue || null },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="group mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
              style={item.active ? { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" } : {}}
            >
              <item.icon className={`h-4 w-4 ${item.active ? "text-violet-400" : "text-white/30 group-hover:text-white/60"} transition-colors`} />
              <span className={`flex-1 text-sm font-semibold ${item.active ? "text-white" : "text-white/40 group-hover:text-white/70"} transition-colors`}>
                {item.label}
              </span>
              {item.badge && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">{item.badge}</span>}
              {item.active && <div className="h-4 w-1 rounded-full" style={{ background: "linear-gradient(180deg,#7c3aed,#4f46e5)" }} />}
            </motion.div>
          ))}

          <motion.div
            className="relative mx-1 mt-6 overflow-hidden rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ background: "linear-gradient(135deg,#1a1030,#120e24)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <p className="relative z-10 mb-3 text-xs font-black text-white/70">Weekly Progress</p>
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0">
                <svg className="h-14 w-14 -rotate-90" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke="url(#sg)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-white">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-black leading-none text-white">
                  {counts.completed}<span className="text-sm text-white/30">/{tasks.length}</span>
                </p>
                <p className="mt-1 text-[10px] font-semibold text-white/30">Tasks done</p>
              </div>
            </div>
          </motion.div>
        </nav>

        <div className="relative z-10 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-all hover:bg-white/[0.04]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white/80">My Workspace</p>
              <p className="text-[10px] text-white/30">Personal</p>
            </div>
            <Settings className="h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
          </div>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6 lg:px-8"
          style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white/30">{today}</p>
          </div>
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-52 rounded-xl pl-9 pr-4 text-sm font-medium text-white/80 outline-none placeholder:text-white/20"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white/[0.07]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <Bell className="h-4 w-4 text-white/40" />
            {counts.overdue > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
          <motion.button
            onClick={() => {
              setEditTask(null);
              setFormOpen(true);
            }}
            className="flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-black text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </motion.button>
        </motion.header>

        <main className="flex-1 space-y-8 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-2xl font-black text-white">Project Board</h1>
              <span className="rounded-lg px-2.5 py-1 text-xs font-black" style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>
                {tasks.length} tasks
              </span>
            </div>
            <p className="text-sm font-medium text-white/30">Drag cards between columns to update status.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STAT_CONFIG.map((stat) => (
              <StatCard key={stat.key} {...stat} value={counts[stat.key]} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className="h-8 rounded-xl px-3 text-xs font-black transition-all"
                style={
                  activeFilter === filter.key
                    ? { background: "rgba(124,58,237,0.24)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.35)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.36)", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-5 overflow-x-auto pb-3">
                {COLUMNS.map((status, i) => (
                  <motion.div
                    key={status}
                    className="min-w-[280px] flex-1"
                    style={{ maxWidth: 420 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.8, duration: 0.5 }}
                  >
                    <KanbanColumn
                      status={status}
                      tasks={filteredByCol[status]}
                      onEdit={(task) => {
                        setEditTask(task);
                        setFormOpen(true);
                      }}
                      onDelete={(task) => setDeleteTask(task)}
                    />
                  </motion.div>
                ))}
              </div>
            </DragDropContext>
          </motion.div>
        </main>
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={(value) => {
          setFormOpen(value);
          if (!value) setEditTask(null);
        }}
        task={editTask}
        onSubmit={(data) => (editTask ? updateTask(editTask.id, data) : createTask(data))}
        isLoading={false}
      />
      <DeleteTaskDialog
        open={Boolean(deleteTask)}
        onOpenChange={(value) => {
          if (!value) setDeleteTask(null);
        }}
        task={deleteTask}
        onConfirm={() => {
          setTasks((prev) => prev.filter((task) => task.id !== deleteTask.id));
          setDeleteTask(null);
        }}
        isLoading={false}
      />
    </div>
  );
}
