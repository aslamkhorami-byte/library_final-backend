const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resource", resourceRoutes);

app.get("/", (req, res) => {
  res.send("Library Backend is running");
});

// error middlewares (ALWAYS at the end)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
