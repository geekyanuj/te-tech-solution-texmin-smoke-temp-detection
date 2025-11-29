import mqtt from "mqtt";
import { MQTT, APP_ENV } from "./env.js";

const connectUrl = `mqtt://${MQTT[APP_ENV].host}:${MQTT[APP_ENV].port}`;

export const mqttClient = mqtt.connect(connectUrl, {
  clean: true,
  connectTimeout: 4000,
  username: MQTT[APP_ENV].username,
  password: MQTT[APP_ENV].password,
  reconnectPeriod: 1000
});
