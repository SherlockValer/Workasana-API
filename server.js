// Connect to database
const { connectDB } = require("./db/connectDB");
connectDB();

// Import express
const express = require("express");
const app = express();
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const tagRoutes = require("./routes/tagRoutes");
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

// Global Error handling middleware
app.use(globalErrorHandler);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
