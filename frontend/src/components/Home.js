import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"
    }}>
      <h1 style={{ fontSize: 48, color: "#1976d2", marginBottom: 16 }}>Task Manager</h1>
      <p style={{ fontSize: 20, color: "#333", marginBottom: 32 }}>
        Organize your work, manage your tasks, and collaborate securely.<br />
        <span style={{ color: "#1976d2" }}>Role-based access</span> for admins and users.
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/login">
          <button style={{ padding: "12px 32px", fontSize: 18, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Login / Register
          </button>
        </Link>
        <Link to="/about">
          <button style={{ padding: "12px 32px", fontSize: 18, background: "#fff", color: "#1976d2", border: "2px solid #1976d2", borderRadius: 8, cursor: "pointer" }}>
            About
          </button>
        </Link>
      </div>
    </div>
  );
}
