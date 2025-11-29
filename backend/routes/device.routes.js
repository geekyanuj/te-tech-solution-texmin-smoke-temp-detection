import { Router } from "express";
import { registerDevice, getDevices } from "../controllers/device.controller.js";

const router = Router();

router.post("/register", registerDevice);
router.get("/:clusterId/get-devices", getDevices);

export default router;
