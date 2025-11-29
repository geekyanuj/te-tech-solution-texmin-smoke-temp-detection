import jwt from "jsonwebtoken";
const JWT_SECRET = "YOUR_SECRET_KEY";

let tokenBlacklist = []; // same reference

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "Token missing" });

  const token = header.split(" ")[1];

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Token invalid (logged out)" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
