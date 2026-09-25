import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function tokenFor(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { name, email, password, jurisdiction } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email: email.toLowerCase(), password: hashed,
      jurisdiction: jurisdiction || "Other / Not sure"
    });

    res.status(201).json({
      token: tokenFor(user),
      user: { id: user._id, name: user.name, email: user.email, jurisdiction: user.jurisdiction }
    });
  } catch (e) {
    res.status(500).json({ message: "Unable to create the account." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    res.json({
      token: tokenFor(user),
      user: { id: user._id, name: user.name, email: user.email, jurisdiction: user.jurisdiction }
    });
  } catch {
    res.status(500).json({ message: "Unable to log in." });
  }
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: { id: user._id, name: user.name, email: user.email, jurisdiction: user.jurisdiction } });
}
