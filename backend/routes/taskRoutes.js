const express = require("express");
const { body } = require("express-validator");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

const statusValues = ["todo", "in_progress", "completed"];
const priorityValues = ["low", "medium", "high"];

const createValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(statusValues).withMessage("Invalid status"),
  body("priority").optional().isIn(priorityValues).withMessage("Invalid priority"),
  body("due_date").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Invalid date format"),
];

const updateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(statusValues).withMessage("Invalid status"),
  body("priority").optional().isIn(priorityValues).withMessage("Invalid priority"),
  body("due_date").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Invalid date format"),
];

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createValidation, createTask);
router.put("/:id", updateValidation, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
