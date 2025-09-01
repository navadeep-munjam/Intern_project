
const router = express.Router();

// Public endpoint to get a user's UID by email
router.get("/getUidByEmail", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email required" });
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        res.json({ uid: userRecord.uid, email: userRecord.email });
    } catch (err) {
        res.status(404).json({ message: "User not found" });
    }
});
import express from "express";
import admin from "../firebase/admin.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { auditLog } from "../middleware/audit.middleware.js";


// Public endpoint to auto-assign 'user' role to new users (called after registration)
router.post("/autoAssignUserRole", async (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: "uid required" });
    try {
        await admin.auth().setCustomUserClaims(uid, { role: "user" });
        res.json({ message: "User role assigned" });
    } catch (err) {
        res.status(500).json({ message: "Error assigning user role" });
    }
});
// Simple logging middleware
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Admin endpoint to set role on a user (by uid or email)
router.post(
    "/setRole",
    verifyFirebaseToken,
    requireRole("admin"),
    auditLog("SET_ROLE"),
    async (req, res) => {
        const { uid, role } = req.body;
        if (!uid || !role) {
            return res.status(400).json({ message: "uid and role required" });
        }
        try {
            await admin.auth().setCustomUserClaims(uid, { role });
            const userRecord = await admin.auth().getUser(uid);
            res.json({ message: "Role set", user: { uid: userRecord.uid, email: userRecord.email } });
        } catch (err) {
            res.status(500).json({ message: "Error setting role" });
        }
    }
);

export default router;
