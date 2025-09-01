import React, { useState } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import NeumorphicCard from "./NeumorphicCard";
import NeumorphicButton from "./NeumorphicButton";
import { showToast } from "./Toast";

export default function Profile({ user, role }) {
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePasswordReset() {
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      showToast("Password reset email sent!", "success");
    } catch (err) {
      showToast(err.message || "Failed to send reset email", "error");
    }
    setLoading(false);
  }

  return (
    <NeumorphicCard className="max-w-md mx-auto p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-neu hover:shadow-neu-btn transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <MailCheck size={28} className="text-[#1976d2]" />
        <h3 className="text-2xl font-bold text-[#1976d2]">User Profile</h3>
      </div>

      {/* User Info */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-inner">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-800 break-all">{user.email}</span>
        </div>
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-inner">
          <span className="font-semibold text-gray-700">Role:</span>
          <span className="text-gray-800 capitalize">{role}</span>
        </div>
      </div>

      {/* Password Reset Button */}
      <NeumorphicButton
        onClick={handlePasswordReset}
        disabled={resetSent || loading}
        className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all
          ${resetSent ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600 active:translate-y-1"}`}
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        {resetSent ? "Reset Email Sent" : loading ? "Sending..." : "Send Password Reset Email"}
      </NeumorphicButton>

      {/* Success Message */}
      {resetSent && (
        <p className="mt-4 text-green-600 text-center text-sm font-medium">
          Check your email to reset your password.
        </p>
      )}
    </NeumorphicCard>
  );
}
