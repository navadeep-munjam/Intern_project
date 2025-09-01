import React from "react";

export default function NeumorphicButton({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-[#e0eafc] rounded-xl px-6 py-2 shadow-neumorphic hover:shadow-neumorphic-inset transition-all font-semibold text-[#1976d2] ${className}`}
      style={{ boxShadow: "4px 4px 12px #b8c6db, -4px -4px 12px #ffffff" }}
      {...props}
    >
      {children}
    </button>
  );
}
