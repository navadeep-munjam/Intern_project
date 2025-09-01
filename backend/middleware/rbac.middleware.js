// middleware/rbac.middleware.js

// Advanced RBAC middleware: supports single role, array of roles, or permission check
export function requireRole(rolesOrCheck) {
  return (req, res, next) => {
    const decoded = req.decodedToken || {};
    const userRole = decoded.role || decoded.roles || (decoded.customClaims && decoded.customClaims.role) || req.user?.role;
    if (!userRole) return res.status(403).json({ message: "No role assigned" });

    // If a function is passed, call it for advanced permission check
    if (typeof rolesOrCheck === "function") {
      if (rolesOrCheck(userRole, req)) return next();
    } else if (Array.isArray(rolesOrCheck)) {
      if (rolesOrCheck.includes(userRole)) return next();
    } else {
      if (userRole === rolesOrCheck) return next();
    }
    return res.status(403).json({ message: "Insufficient role" });
  };
}
