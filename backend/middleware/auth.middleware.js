// middleware/auth.middleware.js
import admin from "../firebase/admin.js";
import logger from "../utils/logger.js";

export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    logger.warn("Missing or invalid Authorization header");
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Extract role from custom claims
    const role =
      decoded.role ||
      decoded.roles ||
      decoded.customClaims?.role ||
      decoded.claims?.role ||
      "user"; // default

    req.decodedToken = { ...decoded, role };
    req.user = { uid: decoded.uid, email: decoded.email, role };

    logger.info(`Verified token: UID=${decoded.uid}, role=${role}`);

    next();
  } catch (err) {
    logger.error("Firebase token verification failed", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
