import _ from "lodash";
import moment from "moment-timezone";

import { mqttClient } from "../config/mqttConfig.js";
import { Device } from "../models/device.model.js";
import { Telemetry } from "../models/telemetry.model.js";
import { SmokeThreshold } from "../models/smoke-threshold.model.js";
import { TempThreshold } from "../models/temp-threshold.model.js";

mqttClient.on("connect", () => {
  console.log("Connected to MQTT");
});

export function subscribe(topics) {
  mqttClient.subscribe(topics, () => {
    console.log("Subscribed:", topics);
  });
}

mqttClient.on("message", async (topic, payload) => {
  try {
    const raw = payload.toString();
    const isCommand = raw === "on" || raw === "off";

    const deviceColl = Device();
    const telemetryColl = Telemetry();
    const thresholdColl = Threshold();

    let data = isCommand ? raw : JSON.parse(raw);

    const device = await deviceColl.findOne({ deviceid: topic });
    const clusterId = device?.clusterId;

    await telemetryColl.insertOne({
      data,
      topic,
      clusterId,
      type: isCommand ? "command" : "telemetry",
      _ts: Date.now()
    });

    if (isCommand) {
      await deviceColl.updateOne(
        { deviceid: topic },
        { $set: { status: raw } }
      );
    } else {
      const state = data.sprinkler || "off";
      await deviceColl.updateOne(
        { deviceid: topic },
        { $set: { status: state.toLowerCase() } }
      );

      const pm10 = data.pm10 || 0;
      const pm25 = data.pm2_5 || 0;

      let threshold = await thresholdColl.findOne({ _id: `threshold-${clusterId}` });
      threshold = threshold || { pm10: 100, pm2_5: 100 };

      const pumps = await deviceColl.find({ isPump: true, clusterId }).toArray();

      if (pm10 > threshold.pm10 || pm25 > threshold.pm2_5) {
        pumps.forEach(p => mqttClient.publish(p.deviceid, "on"));
      } else if (pm10 < threshold.pm10 - 20 || pm25 < threshold.pm2_5 - 20) {
        pumps.forEach(p => mqttClient.publish(p.deviceid, "off"));
      }
    }
  } catch (err) {
    console.log("MQTT Error:", err);
  }
});
