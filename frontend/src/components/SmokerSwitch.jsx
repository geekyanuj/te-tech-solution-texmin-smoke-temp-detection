// ==== components/SmokerSwitch.jsx ====
import React, { useContext, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { TbAlarmSmoke } from "react-icons/tb";
import { MqttContext } from "../context/MqqtContext";

const TOPIC_STATUS = "status/smoker";
const TOPIC_GET = "status/smoker/get";
const TOPIC_CMD = "smoker";

export default function SmokerSwitch() {
  const { isConnected, subscribeToTopic, publish } = useContext(MqttContext);
  const [status, setStatus] = useState(null); // "On" | "Off" | null
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now()); // Timestamp for last status update

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to the status topic
    const unsub = subscribeToTopic(TOPIC_STATUS, (msg) => {
      const s = msg.toLowerCase() === "on" ? "On" : "Off";
      setStatus((prev) => (prev === s ? prev : s));
      setLastUpdateTime(Date.now()); // Update the time when the status changes
    });

    // Request the current status when the component mounts
    publish(TOPIC_GET, "get");

    // Poll every 10 seconds to check if the status is still updated
    const intervalId = setInterval(() => {
      if (Date.now() - lastUpdateTime > 10000) {
        setStatus(null); // Reset to null if no update in the last 10 seconds
      }
    }, 10000); // 10 seconds

    return () => {
      unsub && unsub();
      clearInterval(intervalId); // Cleanup the interval on unmount
    };
  }, [isConnected, subscribeToTopic, publish, lastUpdateTime]);

  const handleSmokeSwitch = (e) => {
    const on = e.target.checked;
    publish(TOPIC_CMD, on ? "on" : "off");
    setStatus(on ? "On" : "Off");
    setLastUpdateTime(Date.now()); // Update the time when the switch is changed
  };

  return (
    <Card className="text-center p-3 h-100" style={{ backgroundColor: "#C3FFFF" }}>
      {/* 🔴🟢 LED Indicator */}
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "30%",
            backgroundColor:
              status === "On"
                ? "green"
                : status === "Off"
                ? "red"
                : "gray",
            boxShadow:
              status === "On" || status === "Off"
                ? `0 0 10px ${status === "On" ? "green" : "red"}`
                : "none",
            transition: "background-color 0.3s, box-shadow 0.3s"
          }}
        ></div>
        <small className="text-muted">{status || "..."}</small>
        <TbAlarmSmoke size={30} style={{ color: "#fb4b00ff" }} />
      </div>
      <div className="d-flex align-items-center gap-3">
        {/* Label and Switch */}
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <span>Smoker Switch</span>
          <Form.Check
            type="switch"
            checked={status === "On"}
            onChange={handleSmokeSwitch}
            disabled={status === null}
          />
        </div>
      </div>
    </Card>
  );
}
