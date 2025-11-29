import { getDB } from "../config/db.js";

export function TempThreshold() {
  return getDB().collection("temp-threshold");
}
