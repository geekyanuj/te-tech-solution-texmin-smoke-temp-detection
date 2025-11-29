import { SmokeThreshold } from "../models/smoke-threshold.model.js";

export async function getThreshold(req, res) {
  const clusterId = req.params.clusterId;
  const data = await SmokeThreshold().findOne({ _id: `threshold-${clusterId}` });
  res.json({ message: "Fetched", data });
}

export async function updateThreshold(req, res) {
  const clusterId = req.params.clusterId;
  const { pm2_5, pm10 } = req.body;

  await SmokeThreshold().updateOne(
    { _id: `threshold-${clusterId}` },
    { $set: { pm2_5, pm10, _ts: Date.now() } },
    { upsert: true }
  );

  res.json({ message: "Updated", data: { pm2_5, pm10 } });
}
