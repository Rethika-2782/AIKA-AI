import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Simple in-memory brute-force guard: 8 failed attempts per email+IP
 * inside a 15 minute window, then 429. Keeps credential stuffing slow
 * without adding an external dependency.
 */
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { first: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(key) {
  attempts.delete(key);
}

export async function register(req, res) {
  try {
    const { name, password, jurisdiction } = req.body || {};
    const email = normalizeEmail(req.body?.email);

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name: name.trim(), email, password, jurisdiction });
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: user.toJSON() });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    res.status(500).json({ success: false, message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const key = `${email}:${req.ip}`;
    if (tooManyAttempts(key)) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please wait 15 minutes and try again."
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    clearAttempts(key);
    const token = signToken(user._id);
    res.json({ success: true, token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
}

export async function me(req, res) {
  res.json({ success: true, user: req.user.toJSON() });
}
