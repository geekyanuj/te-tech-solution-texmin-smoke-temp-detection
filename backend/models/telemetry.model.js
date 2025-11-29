import { getDB } from "../config/db.js";

export function Telemetry() {
  return getDB().collection("telemetry-data");
}
