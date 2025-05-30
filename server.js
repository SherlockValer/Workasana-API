// Connect to database
const { connectDB } = require("./db/connectDB");
const express = require("express");

async function start() {
  await connectDB();

  // Import express

  const app = express();
  app.use(express.json());

  // Import cors
  const cors = require("cors");
  app.use(cors());

  // Import routes
  const authRoutes = require("./routes/authRoutes");
  const taskRoutes = require("./routes/taskRoutes");
  const teamRoutes = require("./routes/teamRoutes");
  const projectRoutes = require("./routes/projectRoutes");
  const tagRoutes = require("./routes/tagRoutes");
  const reportRoutes = require("./routes/reportRoutes");
  const userRoutes = require("./routes/userRoutes");
  const { globalErrorHandler } = require("./middlewares/errorMiddleware");

  // Authentication API
  app.use("/auth", authRoutes);

  // Tasks API
  app.use("/tasks", taskRoutes);

  // Teams API
  app.use("/teams", teamRoutes);

  // Project API
  app.use("/projects", projectRoutes);

  // Tags API
  app.use("/tags", tagRoutes);

  // Reports API
  app.use("/report", reportRoutes);

  // Users API
  app.use("/users", userRoutes);

  // Global Error handling middleware
  app.use(globalErrorHandler);

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

start();
