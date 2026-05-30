import { AlertTriangle, Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";

const PRI = {
  low: { label: "Low", dot: "#3b82f6", bg: "rgba(59,130,246,0.12)", text: "#60a5fa" },
  medium: { label: "Med", dot: "#7c3aed", bg: "rgba(124,58,237,0.12)", text: "#a78bfa" },
  high: { label: "High", dot: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "#f87171" },
};

export default function TaskCard({ task, onEdit, onDelete, dragHandleProps, accent = "#6366f1" }) {
  const isOverdue = task.due_date && task.status !== "completed" && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
  const isDueToday = task.due_date && isToday(new Date(task.due_date));
  const p = PRI[task.priority] || PRI.medium;
  const done = task.status === "completed";

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-xl"
      style={{
        background: "linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
      }}
      whileHover={{
        background: "linear-gradient(135deg,rgba(255,255,255,0.085),rgba(255,255,255,0.045))",
        border: `1px solid ${accent}44`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${accent}22`,
        y: -2,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      }}
    >
      <motion.div
        className="absolute bottom-0 left-0 top-0 w-0.5 rounded-r"
        style={{ background: `linear-gradient(180deg,${accent},${accent}66)` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4 }}
      />

      <div className="flex gap-2.5 p-4">
        <div {...dragHandleProps} className="mt-0.5 shrink-0 cursor-grab opacity-0 transition-all active:cursor-grabbing group-hover:opacity-100">
          <GripVertical className="h-3.5 w-3.5 text-white/20" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className={`flex-1 text-sm font-bold leading-snug ${done ? "text-white/20 line-through" : "text-white/85"}`}>{task.title}</h3>
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-all group-hover:opacity-100">
              <motion.button
                onClick={() => onEdit(task)}
                className="flex h-6 w-6 items-center justify-center rounded-lg"
                whileHover={{ background: "rgba(124,58,237,0.25)", scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Edit task"
              >
                <Pencil className="h-3 w-3 text-violet-400" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(task)}
                className="flex h-6 w-6 items-center justify-center rounded-lg"
                whileHover={{ background: "rgba(239,68,68,0.2)", scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Delete task"
              >
                <Trash2 className="h-3 w-3 text-rose-400" />
              </motion.button>
            </div>
          </div>

          {task.description && <p className="mb-3 line-clamp-2 text-[11px] font-medium leading-relaxed text-white/30">{task.description}</p>}

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-black" style={{ background: p.bg, color: p.text }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: p.dot }} />
              {p.label}
            </span>
            {task.due_date && (
              <span
                className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-black"
                style={
                  isOverdue
                    ? { background: "rgba(239,68,68,0.15)", color: "#f87171" }
                    : isDueToday
                      ? { background: "rgba(245,158,11,0.15)", color: "#fbbf24" }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {isOverdue ? <AlertTriangle className="h-2.5 w-2.5" /> : <Calendar className="h-2.5 w-2.5" />}
                {isOverdue ? "Overdue" : isDueToday ? "Today" : format(new Date(task.due_date), "MMM d")}
              </span>
            )}
            {done && <span className="ml-auto text-[10px] font-black text-emerald-400/80">Done</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
