import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: false, // adjust as needed for frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true },
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
  })
];
