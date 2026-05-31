require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "https://your-app.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "TaskFlow API is running" }));
app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
