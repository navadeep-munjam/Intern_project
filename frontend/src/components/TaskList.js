import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "./Toast";
import NeumorphicCard from "./NeumorphicCard";
import NeumorphicButton from "./NeumorphicButton";

export default function TaskListNeumorphic({ user, idToken }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      showToast("Failed to fetch tasks", "error");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (idToken) fetchTasks();
    // eslint-disable-next-line
  }, [idToken]);

  async function handleDelete(id) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      showToast("Task deleted", "success");
      fetchTasks();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  }

  function startEdit(task) {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditCompleted(task.completed);
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
    setEditCompleted(false);
  }

  async function handleEditSave(id) {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          title: editTitle,
          description: editDesc,
          completed: editCompleted,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      showToast("Task updated", "success");
      cancelEdit();
      fetchTasks();
    } catch (err) {
      showToast("Update failed", "error");
    }
  }

  async function handleCreateTask() {
    if (!newTitle.trim()) return showToast("Title cannot be empty", "error");
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        { title: newTitle, description: newDesc },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      showToast("Task created", "success");
      setNewTitle("");
      setNewDesc("");
      fetchTasks();
    } catch (err) {
      showToast("Failed to create task", "error");
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Tasks</h3>

      {/* Create Task Section */}
      <NeumorphicCard className="p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-neu flex flex-col space-y-4">
        <div className="relative">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder=" "
            className="peer w-full px-4 py-3 rounded-xl shadow-inner bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
            Task Title
          </label>
        </div>
        <div className="relative">
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder=" "
            className="peer w-full px-4 py-3 rounded-xl shadow-inner bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            rows={3}
          />
          <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
            Task Description
          </label>
        </div>
        <NeumorphicButton
          onClick={handleCreateTask}
          className="self-end bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          + Create Task
        </NeumorphicButton>
      </NeumorphicCard>

      {loading && (
        <div className="text-gray-600 animate-pulse">Loading tasks...</div>
      )}

      {/* Tasks Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((t) => (
          <NeumorphicCard
            key={t._id}
            className="p-5 bg-white/70 backdrop-blur-md rounded-2xl shadow-neu hover:shadow-neu-btn transition transform hover:-translate-y-1"
          >
            {editId === t._id ? (
              <div className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Task Title"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                  placeholder="Task Description"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={(e) => setEditCompleted(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>Completed</span>
                </label>
                <div className="flex space-x-3 mt-2">
                  <NeumorphicButton
                    onClick={() => handleEditSave(t._id)}
                    className="bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Save
                  </NeumorphicButton>
                  <NeumorphicButton
                    onClick={cancelEdit}
                    className="bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Cancel
                  </NeumorphicButton>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {t.title}
                    </h4>
                    <p className="text-gray-600">{t.description}</p>
                    <span
                      className={`px-2 py-1 mt-2 inline-block text-sm font-medium rounded ${
                        t.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.completed ? "Done" : "Open"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {(user?.role === "admin" || user?.uid === t.ownerUid) && (
                      <NeumorphicButton
                        onClick={() => startEdit(t)}
                        className="bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Edit
                      </NeumorphicButton>
                    )}
                    {user?.role === "admin" && (
                      <NeumorphicButton
                        onClick={() => handleDelete(t._id)}
                        className="bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </NeumorphicButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
}
