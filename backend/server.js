import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import telemetryRoutes from "./routes/telemetry.routes.js";
import smokeThresholdRoutes from "./routes/smoke-threshold.routes.js";
import tempThresholdRoutes from "./routes/temp-threshold.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/device", deviceRoutes);
app.use("/telemetry", telemetryRoutes);
app.use("/temp-threshold", tempThresholdRoutes);
app.use("/smoke-threshold", smokeThresholdRoutes);

app.listen(3000, async () => {
  console.log("Server running on port 3000");
  await connectDB();
});
