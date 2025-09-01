// Example: permission check middleware for fine-grained access
export function requirePermission(permission) {
  return (req, res, next) => {
    const decoded = req.decodedToken || {};
    const permissions = decoded.permissions || [];
    if (permissions.includes(permission)) return next();
    return res.status(403).json({ message: "Insufficient permissions" });
  };
}
