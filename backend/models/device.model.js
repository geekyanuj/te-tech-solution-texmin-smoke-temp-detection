import { getDB } from "../config/db.js";

export function Device() {
  return getDB().collection("devices");
}

