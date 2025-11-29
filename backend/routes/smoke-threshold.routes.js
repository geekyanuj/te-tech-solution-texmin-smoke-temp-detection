import { Router } from "express";
import {
  getThreshold,
  updateThreshold,
} from "../controllers/smoke-threshold.controller.js";

const router = Router();

// GET Smoke Threshold by Cluster ID
router.get("/:clusterId", getThreshold);

// UPDATE Smoke Threshold
router.put("/:clusterId", updateThreshold);

export default router;
