import jwt from "jsonwebtoken";

/**
 * protect — Express middleware that checks for a valid JWT.
 * Attach it to any route that requires admin login.
 */
export function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorised — no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, username }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
}
