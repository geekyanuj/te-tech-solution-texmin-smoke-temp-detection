import { getDB } from "../config/db.js";

export function SmokeThreshold() {
  return getDB().collection("smoke-threshold");
}
