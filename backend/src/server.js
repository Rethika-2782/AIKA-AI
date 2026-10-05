import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174"
];
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)) }));
app.disable("x-powered-by");

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AIKA AI backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function seedDemoAccount() {
  if (process.env.NODE_ENV === "production") return;
  try {
    const exists = await User.findOne({ email: "demo@aika.ai" });
    if (!exists) {
      await User.create({ name: "Demo User", email: "demo@aika.ai", password: "AikaDemo@123", jurisdiction: "India" });
      console.log("Development demo account created: demo@aika.ai");
    }
  } catch (e) {
    console.error("Demo account seeding failed:", e.message);
  }
}

connectDB()
  .then(seedDemoAccount)
  .then(() => app.listen(PORT, () => console.log(`AIKA backend running on port ${PORT}`)))
  .catch(() => process.exit(1));
