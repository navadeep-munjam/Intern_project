// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  ownerUid: { type: String, required: true }, // UID from Firebase
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
