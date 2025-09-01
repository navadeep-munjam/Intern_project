import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { showToast } from "./Toast";
import NeumorphicCard from "./NeumorphicCard";
import NeumorphicButton from "./NeumorphicButton";
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Loader2, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

    async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          // Auto-assign 'user' role after registration
          try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/autoAssignUserRole`, {
              uid: userCredential.user.uid
            });
          } catch (e) {
            showToast("Failed to assign user role. Contact admin.", "error");
          }
          showToast("Registration successful! Please log out and log in again to activate your account.", "success");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, pass);
        showToast("Login successful!", "success");
      }
      if (onLogin) onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      showToast("Google login successful!", "success");
      if (onLogin) onLogin(result.user);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <NeumorphicCard className="p-6 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            {isRegister ? <UserPlus size={28} className="text-[#1976d2]" /> : <LogIn size={28} className="text-[#1976d2]" />}
            <h3 className="text-2xl font-bold text-[#1976d2]">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center bg-[#e0eafc] rounded-xl px-3 py-2 shadow-inner">
              <Mail size={20} className="mr-2 text-[#1976d2]" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                type="email"
                className="bg-transparent outline-none flex-1 text-[#1976d2] placeholder:text-[#6b8bbd]"
                required
              />
            </div>

            <div className="flex items-center bg-[#e0eafc] rounded-xl px-3 py-2 shadow-inner relative">
              <Lock size={20} className="mr-2 text-[#1976d2]" />
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
                type={showPass ? "text" : "password"}
                className="bg-transparent outline-none flex-1 text-[#1976d2] placeholder:text-[#6b8bbd]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 text-[#1976d2] hover:text-blue-800"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <NeumorphicButton type="submit" className="w-full mt-2 flex items-center justify-center" disabled={loading}>
              {loading ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : null}
              {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
            </NeumorphicButton>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social login */}
          <div className="flex gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 flex-1 py-2 rounded-xl bg-white shadow hover:shadow-md transition"
            >
              <Chrome size={20} className="text-[#ea4335]" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 flex-1 py-2 rounded-xl bg-white shadow hover:shadow-md transition"
            >
              <Github size={20} className="text-black" />
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </button>
          </div>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              className="text-[#1976d2] underline text-sm hover:text-blue-700"
              onClick={() => setIsRegister((v) => !v)}
              disabled={loading}
            >
              {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </button>
          </div>
        </NeumorphicCard>
      </motion.div>
    </div>
  );
}
