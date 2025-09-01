import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "./Toast";
import NeumorphicCard from "./NeumorphicCard";
import NeumorphicButton from "./NeumorphicButton";
import { Trash2, Edit3, CheckCircle2 } from "lucide-react";

export default function TaskListNeumorphic({ user, idToken }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // Helper: Convert UTC to IST and format
  function formatIST(timestamp) {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Helper: Calculate time difference
  function timeTaken(createdAt, completedAt) {
    if (!createdAt || !completedAt) return "-";
    const diffMs = new Date(completedAt) - new Date(createdAt);
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Fetch tasks from backend
  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      showToast("Failed to fetch tasks", "error");
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (idToken) fetchTasks();
    // eslint-disable-next-line
  }, [idToken]);

  // Delete task
  async function handleDelete(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      showToast("Task deleted", "success");
      fetchTasks();
    } catch (err) {
      showToast("Delete failed", "error");
      console.error(err);
    }
  }

  // Start editing a task
  function startEdit(task) {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditCompleted(task.completed);
  }

  // Cancel editing
  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
    setEditCompleted(false);
  }

  // Save edited task
  async function handleEditSave(id) {
    try {
      const currentTask = tasks.find((t) => t._id === id);
      const updateData = {
        title: editTitle,
        description: editDesc,
        completed: editCompleted,
      };

      // If task marked complete now and completedAt is missing
      if (editCompleted && !currentTask.completedAt) {
        updateData.completedAt = new Date().toISOString();
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      showToast("Task updated", "success");
      cancelEdit();
      fetchTasks();
    } catch (err) {
      showToast("Update failed", "error");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6 mt-6">
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">Loading tasks...</div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <NeumorphicCard
            key={t._id}
            className="p-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
          >
            {editId === t._id ? (
              <div className="flex flex-col gap-3 w-full">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="px-4 py-2 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Task Title"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="px-4 py-2 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
                  rows={3}
                  placeholder="Task Description"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={(e) => setEditCompleted(e.target.checked)}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Completed</span>
                </label>
                <div className="flex gap-3 mt-2">
                  <NeumorphicButton
                    onClick={() => handleEditSave(t._id)}
                    className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 transition"
                  >
                    <CheckCircle2 size={18} /> Save
                  </NeumorphicButton>
                  <NeumorphicButton
                    onClick={cancelEdit}
                    className="bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2 transition"
                  >
                    Cancel
                  </NeumorphicButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="text-xl font-semibold text-blue-700 mb-1">{t.title}</div>
                  <div className="text-gray-600 mb-2">{t.description}</div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      t.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.completed ? "Done" : "Open"}
                  </span>

                  {/* Display timestamps */}
                  <div className="text-gray-400 text-xs mt-1">
                    Created: {formatIST(t.createdAt || t.created_at || t._id)}
                  </div>
                  {t.completed && (
                    <>
                      <div className="text-gray-400 text-xs">
                        Completed: {formatIST(t.completedAt || t.updatedAt || t.updated_at)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Time taken:{" "}
                        {timeTaken(
                          t.createdAt || t.created_at || t._id,
                          t.completedAt || t.updatedAt || t.updated_at
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  {(user?.role === "admin" || user?.uid === t.ownerUid) && (
                    <NeumorphicButton
                      onClick={() => startEdit(t)}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2 transition"
                    >
                      <Edit3 size={18} /> Edit
                    </NeumorphicButton>
                  )}
                  {user?.role === "admin" && (
                    <NeumorphicButton
                      onClick={() => handleDelete(t._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2 transition"
                    >
                      <Trash2 size={18} /> Delete
                    </NeumorphicButton>
                  )}
                </div>
              </div>
            )}
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
}
