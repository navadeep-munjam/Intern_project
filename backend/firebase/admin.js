// firebase/admin.js
import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
  || "../panda8555-83a82-firebase-adminsdk-fbsvc-a7bf1155c3.json";

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Missing Firebase service account JSON. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
} catch (err) {
  console.error("Failed to read/parse Firebase service account JSON:", err.message);
  process.exit(1);
}

console.log(`Initializing Firebase Admin SDK for project: ${process.env.FIREBASE_PROJECT_ID}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

export default admin;
