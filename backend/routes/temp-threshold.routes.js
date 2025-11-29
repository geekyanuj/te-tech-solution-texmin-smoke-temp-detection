import { Router } from "express";
import {
  getThreshold,
  updateThreshold,
} from "../controllers/temp-threshold.controller.js";

const router = Router();

// GET Temperature Threshold by Cluster ID
router.get("/:clusterId", getThreshold);

// UPDATE Temperature Threshold
router.put("/:clusterId", updateThreshold);

export default router;
