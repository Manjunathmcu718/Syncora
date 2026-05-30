import { Draggable, Droppable } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./TaskCard";

const cfg = {
  todo: { label: "To Do", marker: "Todo", accent: "#6366f1", dropBg: "rgba(99,102,241,0.05)" },
  in_progress: { label: "In Progress", marker: "Work", accent: "#f59e0b", dropBg: "rgba(245,158,11,0.05)" },
  completed: { label: "Completed", marker: "Done", accent: "#10b981", dropBg: "rgba(16,185,129,0.05)" },
};

export default function KanbanColumn({ status, tasks, onEdit, onDelete }) {
  const c = cfg[status];

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-2.5 px-1">
        <motion.div
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: c.accent, boxShadow: `0 0 8px ${c.accent}` }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
        <span className="text-sm font-black tracking-tight text-white/80">{c.label}</span>
        <motion.span
          key={tasks.length}
          className="ml-auto rounded-lg px-2.5 py-1 text-[10px] font-black"
          style={{ background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}33` }}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600 }}
        >
          {tasks.length}
        </motion.span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 rounded-2xl p-3 transition-all duration-200"
            style={{
              minHeight: 420,
              background: snapshot.isDraggingOver ? c.dropBg : "rgba(255,255,255,0.025)",
              border: `1px solid ${snapshot.isDraggingOver ? c.accent + "44" : "rgba(255,255,255,0.06)"}`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(p, snap) => (
                    <div ref={p.innerRef} {...p.draggableProps} style={{ ...p.draggableProps.style, userSelect: "none" }}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: snap.isDragging ? 1.03 : 1,
                          rotate: snap.isDragging ? 1.5 : 0,
                          y: snap.isDragging ? -6 : 0,
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} dragHandleProps={p.dragHandleProps} accent={c.accent} />
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <motion.div
                className="flex flex-col items-center justify-center gap-2.5"
                style={{ flex: 1, opacity: 0.3, minHeight: 140 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
              >
                <div className="flex h-10 w-16 items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-wider" style={{ background: `${c.accent}18`, border: `1px dashed ${c.accent}44`, color: c.accent }}>
                  {c.marker}
                </div>
                <p className="text-xs font-bold text-white/40">Drop tasks here</p>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
