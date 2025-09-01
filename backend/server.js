// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { securityMiddleware } from "./middleware/security.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";

import tasksRouter from "./routes/tasks.routes.js";
import adminRouter from "./routes/admin.routes.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    // Only allow whitelisted origins
    const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// 🔹 Morgan logging piped to Winston
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// 🔹 Log POST/PUT request bodies (mask sensitive info)
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "[MASKED]";
    if (safeBody.token) safeBody.token = "[MASKED]";
    logger.info(`Request Body: ${JSON.stringify(safeBody)}`);
  }
  next();
});

app.use(...securityMiddleware);

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info("MongoDB connected"))
  .catch(err => {
    logger.error("MongoDB connection error", err);
    process.exit(1);
  });
app.use("/api/tasks", tasksRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => res.send("Task API running"));

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
