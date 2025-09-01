import React, { useState } from "react";
import axios from "axios";
import { showToast } from "./Toast";
import { auth } from "../firebase";
import NeumorphicButton from "./NeumorphicButton";

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("Please login first", "error");
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken(true);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        { title, description: desc, priority },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setTitle("");
      setDesc("");
      setPriority("Medium");
      showToast("Task created", "success");
      onCreated && onCreated();
    } catch (err) {
      console.error("Create task error:", err.response?.data || err.message);
      showToast("Create failed", "error");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleCreate}
      className="p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-neu flex flex-col gap-5 max-w-lg mx-auto transition-all hover:shadow-neu-btn"
    >
      {/* Title Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=" "
          required
          className="peer w-full px-4 py-3 rounded-2xl shadow-inner bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
          Title
        </label>
      </div>

      {/* Description Input */}
      <div className="relative w-full">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder=" "
          rows={4}
          className="peer w-full px-4 py-3 rounded-2xl shadow-inner bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
        />
        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
          Description
        </label>
        <span className="text-xs text-gray-400 absolute right-4 bottom-2">
          {desc.length}/250
        </span>
      </div>

      {/* Priority Selector */}
      <div className="flex items-center gap-3">
        <label className="text-gray-700 font-medium">Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 rounded-xl shadow-inner bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="High" className="text-red-600">High</option>
          <option value="Medium" className="text-yellow-600">Medium</option>
          <option value="Low" className="text-green-600">Low</option>
        </select>
      </div>

      {/* Submit Button */}
      <NeumorphicButton
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white hover:bg-blue-600 active:translate-y-1 transition-all px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? "Creating..." : "Create Task"}
      </NeumorphicButton>
    </form>
  );
}
