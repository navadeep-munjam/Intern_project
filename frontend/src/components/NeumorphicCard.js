import React from "react";

export default function NeumorphicCard({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-[#e0eafc] rounded-2xl shadow-neumorphic p-6 ${className}`}
      style={{ boxShadow: "8px 8px 24px #b8c6db, -8px -8px 24px #ffffff" }}
      {...props}
    >
      {children}
    </div>
  );
}
