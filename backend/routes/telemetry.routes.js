import { Router } from "express";
import { getTelemetry } from "../controllers/telemetry.controller.js";

const router = Router();

// GET Telemetry for a specific cluster
// Example: /api/telemetry/12?topic=pm2_5&page=1&limit=20&type=telemetry
router.get("/:clusterId", getTelemetry);

export default router;
