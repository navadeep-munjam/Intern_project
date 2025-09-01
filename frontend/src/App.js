import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { jwtDecode } from "jwt-decode";

import Login from "./components/Login";
import TaskListNeumorphic from "./components/TaskListNeumorphic";
import NeumorphicCard from "./components/NeumorphicCard";
import NeumorphicButton from "./components/NeumorphicButton";
import TaskForm from "./components/TaskForm";
import AdminPanel from "./components/AdminPanel";
import Profile from "./components/Profile";
import Toast from "./components/Toast";
import Home from "./components/Home";

export default function App() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskListKey, setTaskListKey] = useState(0);

  const setUserAndToken = async (u) => {
    setLoading(true);
    if (u) {
      setUser(u);
      const token = await u.getIdToken(true);
      setIdToken(token);
      const decoded = jwtDecode(token);
      const userRole =
        decoded.role ||
        (decoded.customClaims && decoded.customClaims.role) ||
        "user";
      setRole(userRole);
    } else {
      setUser(null);
      setIdToken(null);
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUserAndToken);
    return () => unsub();
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const handleTaskCreated = useCallback(() => {
    setTaskListKey((k) => k + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <span className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Toast />
      <div
        className="min-h-screen bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')` }}
      >
        <div className="bg-black/40 min-h-screen p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/app" /> : <Login onLogin={setUserAndToken} />}
            />
            <Route
              path="/app"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : (
                  <div className="max-w-5xl mx-auto py-8 space-y-6">
                    {/* Header */}
                    <NeumorphicCard className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-neu flex flex-col md:flex-row md:justify-between items-center">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          Welcome, {user.email}
                        </h1>
                        <p className="text-gray-600 mt-1 text-lg">Role: {role}</p>
                      </div>
                      <NeumorphicButton
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl shadow-neu-btn hover:shadow-neu-btn-hover"
                      >
                        Logout
                      </NeumorphicButton>
                    </NeumorphicCard>

                    {/* Profile */}
                    <NeumorphicCard className="p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-neu">
                      <Profile user={user} role={role} />
                    </NeumorphicCard>

                    {/* Task Form */}
                    <NeumorphicCard className="p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-neu">
                      <TaskForm idToken={idToken} onCreated={handleTaskCreated} />
                    </NeumorphicCard>

                    {/* Task List */}
                    <TaskListNeumorphic
                      key={taskListKey}
                      user={{ role, uid: user?.uid }}
                      idToken={idToken}
                    />

                    {/* Admin Panel */}
                    {role === "admin" && (
                      <NeumorphicCard className="p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-neu">
                        <AdminPanel idToken={idToken} />
                      </NeumorphicCard>
                    )}
                  </div>
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
