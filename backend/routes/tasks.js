const express = require("express");
const { body } = require("express-validator");
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

const createValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("status").optional().isIn(["todo", "in_progress", "completed"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("due_date").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
];

const updateValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
  body("status").optional().isIn(["todo", "in_progress", "completed"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("due_date").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
];

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createValidation, createTask);
router.put("/:id", updateValidation, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
