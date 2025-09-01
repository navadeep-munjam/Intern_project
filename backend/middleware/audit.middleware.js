import logger from "../utils/logger.js";

// Logs sensitive actions for audit trail
export function auditLog(action) {
  return (req, res, next) => {
    const user = req.user || {};
    logger.info({
      type: "AUDIT",
      action,
      user: { uid: user.uid, email: user.email, role: user.role },
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      time: new Date().toISOString(),
      ip: req.ip
    });
    next();
  };
}
