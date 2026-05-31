const { validationResult } = require("express-validator");
const supabase = require("../config/supabase");

const TABLE_NAME = "tasks";

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;

  res.status(400).json({ success: false, errors: errors.array() });
  return true;
};

const createNotFoundError = () => {
  const err = new Error("Task not found");
  err.statusCode = 404;
  return err;
};

const normalizeTaskPayload = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = body.title;
  if (body.description !== undefined) payload.description = body.description || "";
  if (body.status !== undefined) payload.status = body.status;
  if (body.priority !== undefined) payload.priority = body.priority;
  if (body.due_date !== undefined) payload.due_date = body.due_date || null;

  return payload;
};

const getAllTasks = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", req.params.id).maybeSingle();

    if (error) throw error;
    if (!data) throw createNotFoundError();

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const payload = {
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      due_date: req.body.due_date || null,
    };

    const { data, error } = await supabase.from(TABLE_NAME).insert(payload).select("*").single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const payload = normalizeTaskPayload(req.body);

    const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", req.params.id).select("*").maybeSingle();

    if (error) throw error;
    if (!data) throw createNotFoundError();

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", req.params.id).select("id").maybeSingle();

    if (error) throw error;
    if (!data) throw createNotFoundError();

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
