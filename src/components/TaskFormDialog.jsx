import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, Calendar, Flag, Loader2, Sparkles, Type, X } from "lucide-react";

const inputCls = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: "0 16px",
  height: 44,
  width: "100%",
  fontSize: 14,
  color: "rgba(255,255,255,0.85)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  outline: "none",
};
const selectCls = {
  ...inputCls,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  colorScheme: "dark",
};

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-white/25" />
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">{label}</label>
      </div>
      {children}
    </div>
  );
}

export default function TaskFormDialog({ open, onOpenChange, task, onSubmit, isLoading }) {
  const [form, setForm] = useState({ title: "", description: "", status: "todo", due_date: "", priority: "medium" });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        due_date: task.due_date || "",
        priority: task.priority || "medium",
      });
    } else {
      setForm({ title: "", description: "", status: "todo", due_date: "", priority: "medium" });
    }
    setErr("");
  }, [task, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr("Title is required");
      return;
    }
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-3xl"
        style={{ background: "#0f0d1a", boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2)" }}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="relative overflow-hidden px-7 pb-6 pt-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% -30%,rgba(124,58,237,0.3),transparent 70%)" }} />
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-white/[0.07]"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X className="h-4 w-4 text-white/40" />
          </button>
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg,#7c3aed22,#4f46e522)", border: "1px solid rgba(124,58,237,0.35)" }}
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Sparkles className="h-5 w-5 text-violet-300" />
            </motion.div>
            <div>
              <h2 className="text-lg font-black leading-none text-white">{task ? "Edit Task" : "Create Task"}</h2>
              <p className="mt-1.5 text-xs font-semibold text-white/30">{task ? "Update details below" : "Add something to your board"}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
          <Field label="Title" icon={Type}>
            <input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErr("");
              }}
              placeholder="What needs to be done?"
              style={inputCls}
            />
            {err && <p className="mt-1.5 text-xs font-semibold text-rose-400">{err}</p>}
          </Field>

          <Field label="Description" icon={AlignLeft}>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add context or details..."
              rows={3}
              style={{ ...inputCls, height: "auto", padding: "12px 16px", resize: "none" }}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" icon={Flag}>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={selectCls}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
            <Field label="Priority" icon={Flag}>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>

          <Field label="Due Date" icon={Calendar}>
            <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} style={inputCls} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-xl text-sm font-black transition-all hover:bg-white/[0.05]"
              style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 24px rgba(124,58,237,0.5)" }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(124,58,237,0.65)" }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {task ? "Save Changes" : "Create Task"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
