import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const JWT_SECRET = "YOUR_SECRET_KEY"; // Replace in production

// In-memory blacklist — can be swapped for Redis
let tokenBlacklist = [];

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, password });
    await user.save();

    res.json({
      message: "User registered",
      user: { username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(400).json({ message: "No token provided" });

    tokenBlacklist.push(token); // blacklist token

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export function verifyAuth(req, res) {
  return res.json({
    message: "Authenticated",
    user: req.user
  });
}
