
// ==== hooks/useMqttValue.js (new helper) ====
import { useContext, useEffect, useRef, useState } from "react";
import { MqttContext } from "../context/MqqtContext";

/**
 * Subscribe to a topic and keep latest value in state.
 * Optional normalizeFn to coerce the string message -> value (e.g., Number).
 * Optionally dedup same values to avoid needless re-renders.
 */
export function useMqttValue(topic, { normalizeFn, dedupe = true } = {}) {
  const { isConnected, subscribeToTopic } = useContext(MqttContext);
  const [value, setValue] = useState(null);
  const lastRef = useRef();

  useEffect(() => {
    if (!isConnected) return;
    const unsub = subscribeToTopic(topic, (str) => {
      const v = normalizeFn ? normalizeFn(str) : str;
      if (dedupe && lastRef.current === v) return;
      lastRef.current = v;
      setValue(v);
    });
    return () => { unsub && unsub(); };
  }, [isConnected, subscribeToTopic, topic, normalizeFn, dedupe]);

  return value;
}

