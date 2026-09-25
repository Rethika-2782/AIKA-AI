import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: false
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "LEXORA AI API" }));
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/documents", documentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const port = process.env.PORT || 5000;

await connectDB();

const demoEmail = "demo@lexora.ai";
const existingDemo = await User.findOne({ email: demoEmail });
if (!existingDemo) {
  await User.create({
    name: "LEXORA Demo",
    email: demoEmail,
    password: await bcrypt.hash("LexoraDemo@123", 12),
    jurisdiction: "India"
  });
  console.log("Demo account created: demo@lexora.ai / LexoraDemo@123");
}

app.listen(port, () => console.log(`LEXORA API running on http://localhost:${port}`));
