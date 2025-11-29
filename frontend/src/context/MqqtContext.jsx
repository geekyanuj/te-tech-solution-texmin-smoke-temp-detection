// ==== context/MqqtContext.js (refactored) ====
import React, { createContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import mqtt from "mqtt";

export const MqttContext = createContext({
  isConnected: false,
  subscribeToTopic: () => {},
  unsubscribeFromTopic: () => {},
  publish: () => {},
});

export const MqttProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  // subscribersRef maps topic -> Set(handlers) for O(1) delete and no dups
  const subscribersRef = useRef(/** @type {Record<string, Set<(msg:string)=>void>} */({}));

  useEffect(() => {
    const mqttOptions = {
      connectTimeout: 5000,
      reconnectPeriod: 1000,
      keepalive: 30,
      clean: true,
    };

    const client = mqtt.connect("ws://localhost:8080", mqttOptions);
    clientRef.current = client;

    const handleConnect = () => {
      console.log("✅ MQTT connected");
      setIsConnected(true);
      // Re-subscribe all topics after reconnect (mqtt.js auto does this for clean:false only)
      const topics = Object.keys(subscribersRef.current);
      if (topics.length) client.subscribe(topics);
    };

    const handleReconnect = () => console.log("🔄 MQTT reconnecting...");
    const handleError = (err) => console.error("❌ MQTT connection error:", err);
    const handleClose = () => {
      console.warn("⚠️ MQTT connection closed");
      setIsConnected(false);
    };

    const handleMessage = (topic, message) => {
      const setForTopic = subscribersRef.current[topic];
      if (!setForTopic || setForTopic.size === 0) return;
      const str = message.toString();
      // Fan-out to handlers; try/catch each to avoid breaking loop
      setForTopic.forEach((handler) => {
        try { handler(str); } catch (e) { console.error("Handler error:", e); }
      });
    };

    client.on("connect", handleConnect);
    client.on("reconnect", handleReconnect);
    client.on("error", handleError);
    client.on("close", handleClose);
    client.on("message", handleMessage);

    return () => {
      try { client.end(true); } catch {}
      clientRef.current = null;
      subscribersRef.current = {};
    };
  }, []);

  const subscribeToTopic = useCallback((topic, handler) => {
    const client = clientRef.current;
    if (!client) return () => {};

    if (!subscribersRef.current[topic]) {
      subscribersRef.current[topic] = new Set();
      if (client.connected) client.subscribe(topic);
    }
    subscribersRef.current[topic].add(handler);

    // Return an unsubscribe function for convenience
    return () => {
      const setForTopic = subscribersRef.current[topic];
      if (!setForTopic) return;
      setForTopic.delete(handler);
      if (setForTopic.size === 0) {
        delete subscribersRef.current[topic];
        if (client.connected) client.unsubscribe(topic);
      }
    };
  }, []);

  const unsubscribeFromTopic = useCallback((topic, handler) => {
    const client = clientRef.current;
    const setForTopic = subscribersRef.current[topic];
    if (!setForTopic) return;
    setForTopic.delete(handler);
    if (setForTopic.size === 0) {
      delete subscribersRef.current[topic];
      if (client?.connected) client.unsubscribe(topic);
    }
  }, []);

  const publish = useCallback((topic, message) => {
    const client = clientRef.current;
    if (client && client.connected) client.publish(topic, message);
    else console.warn("🚫 MQTT not connected. Cannot publish:", topic, message);
  }, []);

  const value = useMemo(() => ({
    isConnected,
    subscribeToTopic,
    unsubscribeFromTopic,
    publish,
  }), [isConnected, subscribeToTopic, unsubscribeFromTopic, publish]);

  return (
    <MqttContext.Provider value={value}>{children}</MqttContext.Provider>
  );
};
