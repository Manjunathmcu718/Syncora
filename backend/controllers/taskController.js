const supabase = require("../config/supabase");
const { validationResult } = require("express-validator");

const getAllTasks = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", req.params.id).single();

    if (error || !data) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

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
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, description, status: status || "todo", priority: priority || "medium", due_date }])
      .select()
      .single();

    if (error) throw error;
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
    if (due_date !== undefined) updates.due_date = due_date;

    const { data, error } = await supabase.from("tasks").update(updates).eq("id", req.params.id).select().single();

    if (error || !data) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { error, count } = await supabase.from("tasks").delete({ count: "exact" }).eq("id", req.params.id);

    if (error) throw error;
    if (count === 0) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
