import React, { useState } from "react";
import axios from "axios";
import { showToast } from "./Toast";

export default function AdminPanel({ idToken }) {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("user");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  function verify2FA() {
    return code === "123456"; // demo only
  }

  async function setRoleForUser(e) {
    e.preventDefault();
    if (!verify2FA()) {
      showToast("2FA code invalid", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/setRole`,
        { uid, role },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      showToast(
        "Role set. Note: user needs to re-login to get updated token.",
        "success"
      );
      setUid("");
      setRole("user");
      setCode("");
    } catch (err) {
      showToast(err?.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-4">
      <div className="bg-gray-200 p-8 rounded-2xl shadow-neu max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Admin Panel
        </h2>
        <form className="space-y-5" onSubmit={setRoleForUser}>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-600 font-medium">User UID</label>
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter user UID"
              className="px-4 py-2 rounded-xl shadow-inner focus:shadow-outline focus:outline-none transition-all bg-gray-200 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-600 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 rounded-xl shadow-inner focus:shadow-outline focus:outline-none transition-all bg-gray-200 text-gray-700"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-600 font-medium">2FA Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 2FA code (demo: 123456)"
              className="px-4 py-2 rounded-xl shadow-inner focus:shadow-outline focus:outline-none transition-all bg-gray-200 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-300 rounded-xl shadow-neu-btn hover:shadow-neu-btn-hover transition-all text-gray-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting Role..." : "Set Role"}
          </button>
        </form>
      </div>
    </div>
  );
}
