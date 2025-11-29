import { Device } from "../models/device.model.js";
import { subscribe } from "../services/mqtt.service.js";

export async function registerDevice(req, res) {
  const { topic, isPump, isFan, clusterId } = req.body;

  await Device().insertOne({
    deviceid: topic,
    clusterId,
    status: "off",
    isPump: isPump || false,
    isFan: isFan || false,
    _ts: Date.now()
  });

  subscribe([topic]);

  res.json({ message: "Device registered" });
}

export async function getDevices(req, res) {
  const clusterId = parseInt(req.params.clusterId);
  const data = await Device().find({ clusterId }).toArray();
  res.json({ message: "Success", data });
}
