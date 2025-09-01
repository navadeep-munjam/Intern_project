// routes/tasks.routes.js
import express from "express";
import Task from "../models/Tasks.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { body, query } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { getPagination } from "../utils/pagination.js";
import { auditLog } from "../middleware/audit.middleware.js";
import logger from "../utils/logger.js";

const router = express.Router();

// Create task
router.post(
  "/",
  verifyFirebaseToken,
  requireRole(["user", "admin"]),
  auditLog("CREATE_TASK"),
  [body("title").isString().notEmpty(), body("description").optional().isString()],
  validate,
  async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const ownerUid = req.decodedToken.uid;

      logger.info(`Creating task for UID: ${ownerUid}, Title: ${title}`);

      const task = await Task.create({ title, description, ownerUid });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// Read tasks
router.get(
  "/",
  verifyFirebaseToken,
  requireRole(["user", "admin"]),
  [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })],
  validate,
  async (req, res, next) => {
    try {
      const decoded = req.decodedToken;
      const role = decoded.role;

      logger.info(`Fetching tasks for UID: ${decoded.uid}, Role: ${role}, Query: ${JSON.stringify(req.query)}`);

      const { page, limit, skip } = getPagination(req.query);
      let filter = {};
      if (role !== "admin") filter.ownerUid = decoded.uid;
      if (req.query.completed !== undefined) filter.completed = req.query.completed === "true";

      const tasks = await Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Task.countDocuments(filter);

      res.json({ tasks, page, limit, total });
    } catch (err) {
      next(err);
    }
  }
);

// Update task
router.put(
  "/:id",
  verifyFirebaseToken,
  requireRole(["user", "admin"]),
  auditLog("UPDATE_TASK"),
  [body("title").optional().isString(), body("description").optional().isString(), body("completed").optional().isBoolean()],
  validate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const decoded = req.decodedToken;
      const role = decoded.role;

      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      if (task.ownerUid !== decoded.uid && role !== "admin") {
        logger.warn(`Unauthorized update attempt by UID: ${decoded.uid} on TaskID: ${id}`);
        return res.status(403).json({ message: "Not authorized to update this task" });
      }

      Object.assign(task, req.body);
      await task.save();

      logger.info(`Task updated: TaskID: ${id}, UID: ${decoded.uid}`);
      res.json(task);
    } catch (err) {
      next(err);
    }
  }
);

// Delete task (admin only)
router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  auditLog("DELETE_TASK"),
  async (req, res, next) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      logger.info(`Task deleted: TaskID: ${req.params.id}, by Admin UID: ${req.decodedToken.uid}`);
      res.json({ message: "Deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
