import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function showToast(message, type = "info") {
  if (type === "permission") {
    toast.error("Permission denied: " + message);
  } else {
    toast[type](message);
  }
}

export default function Toast() {
  return <ToastContainer position="top-right" autoClose={3000} />;
}
