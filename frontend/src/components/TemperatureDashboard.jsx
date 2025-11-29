import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const broker = "ws://localhost:8080"; // WebSocket MQTT broker
const topicTemp = "home/temperature";
const topicRelay = "home/relay";
const topicMode = "home/mode";

export default function TemperatureDashboard() {
  const [temp, setTemp] = useState(null);
  const [relay, setRelay] = useState(false);
  const [mode, setMode] = useState("auto");

  useEffect(() => {
    const client = mqtt.connect(broker);

    client.on("connect", () => {
      console.log("Connected to MQTT");
      client.subscribe(topicTemp);
    });

    client.on("message", (topic, message) => {
      if (topic === topicTemp) setTemp(message.toString());
    });

    return () => client.end();
  }, []);

  const toggleRelay = () => {
    if (mode === "manual") {
      setRelay(!relay);
      mqtt.connect(broker).publish(topicRelay, relay ? "off" : "on");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "auto" ? "manual" : "auto";
    setMode(newMode);
    mqtt.connect(broker).publish(topicMode, newMode);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-96">
      <h1 className="text-xl font-bold mb-4">Temperature Dashboard</h1>
      <p className="text-lg">Temperature: {temp ? `${temp} °C` : "Loading..."}</p>
      <p className="text-lg">Mode: {mode}</p>
      <button
        onClick={toggleMode}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3"
      >
        Switch to {mode === "auto" ? "Manual" : "Auto"}
      </button>
      {mode === "manual" && (
        <button
          onClick={toggleRelay}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3"
        >
          Turn Relay {relay ? "Off" : "On"}
        </button>
      )}
    </div>
  );
}