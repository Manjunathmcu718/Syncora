import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteTaskDialog({ open, onOpenChange, task, onConfirm, isLoading }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl p-7"
        style={{ background: "#0f0d1a", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <Trash2 className="h-5 w-5 text-rose-400" />
        </div>
        <h3 className="mb-2 text-lg font-black text-white">Delete Task?</h3>
        <p className="mb-7 text-sm font-medium text-white/40">
          "<span className="text-white/60">{task?.title}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="h-10 flex-1 rounded-xl text-sm font-bold text-white/40 transition-all hover:bg-white/[0.05]"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            Cancel
          </button>
          <motion.button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-black text-white"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,0.4)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
