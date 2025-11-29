import { Telemetry } from "../models/telemetry.model.js";

export async function getTelemetry(req, res) {
  const clusterId = parseInt(req.params.clusterId);
  const { topic, page = 1, limit = 10, type = "telemetry" } = req.query;

  const skip = (page - 1) * limit;

  const query = { clusterId, type };
  if (topic) query.topic = topic;

  const total = await Telemetry().countDocuments(query);

  const data = await Telemetry()
    .find(query)
    .sort({ _ts: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  res.json({
    message: "Telemetry received",
    data,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total
  });
}
