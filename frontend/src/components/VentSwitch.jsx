// VentSwitch.js
import React, { useContext, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { TbAlarmSmoke } from "react-icons/tb";
import { MqttContext } from "../context/MqqtContext";

const topicRelay = "home/relay";
const topicRelaySet = "home/relay/set";
const topicRelayGet = "home/relay/get";

const topicMode = "home/mode";
const topicModeSet = "home/mode/set";
const topicModeGet = "home/mode/get";

export default function VentSwitch() {
  const { isConnected, subscribeToTopic, publish } = useContext(MqttContext);
  const [relay, setRelay] = useState(null);
  const [mode, setMode] = useState(null);
  const [isTogglingMode, setIsTogglingMode] = useState(false);
  const [esp32Connected, setEsp32Connected] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    const unsubRelay = subscribeToTopic(topicRelay, (msg) => {
      const next = msg.toLowerCase() === "on";
      setRelay(next);
    });

    const unsubMode = subscribeToTopic(topicMode, (msg) => {
      const m = msg.toLowerCase();
      setMode(m);
    });

    // Request current state of relay and mode
    publish(topicRelayGet, "get");
    publish(topicModeGet, "get");

    const timeout = setTimeout(() => {
      if (relay === null && mode === null) {
        setEsp32Connected(false);
      } else {
        setEsp32Connected(true);
      }
    }, 5000);

    return () => {
      unsubRelay();
      unsubMode();
      clearTimeout(timeout);
    };
  }, [isConnected, subscribeToTopic, publish, relay, mode]);

  useEffect(() => {
    if (relay !== null && mode !== null) {
      setEsp32Connected(true);
    }
  }, [relay, mode]);

  const toggleRelay = () => {
    if (mode === "manual") {
      const newRelayState = !relay;
      publish(topicRelaySet, newRelayState ? "on" : "off");
      setRelay(newRelayState);
    }
  };

  const toggleMode = () => {
    if (!mode || isTogglingMode) return;
    setIsTogglingMode(true);
    const newMode = mode === "auto" ? "manual" : "auto";
    publish(topicModeSet, newMode);
    setMode(newMode);
    setTimeout(() => {
      setIsTogglingMode(false);
    }, 3000);
  };

  const isModeManual = mode === "manual";
  const ledColor = relay === true ? "green" : relay === false ? "red" : "gray";

  return (
    <Card className="text-center p-3 h-100" style={{ backgroundColor: "#C3FFFF" }}>
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "30%",
            backgroundColor: ledColor,
            boxShadow: relay === null ? "none" : `0 0 10px ${ledColor}`,
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        ></div>
        <small className="text-muted">{relay === true ? "On" : relay === false ? "Off" : "Off"}</small>
        <TbAlarmSmoke size={30} style={{ color: "#fb4b00ff" }} />
      </div>

      <div className="d-flex justify-content-between align-items-center w-100 mt-2">
        <span>Ventilation Mode</span>
        <Form.Check
          type="switch"
          checked={isModeManual}
          onChange={toggleMode}
          disabled={!esp32Connected || isTogglingMode}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center w-100 mt-2">
        <span>Vent Relay</span>
        <Form.Check
          type="switch"
          checked={!!relay}
          onChange={toggleRelay}
          disabled={!esp32Connected || relay === null || !isModeManual}
        />
      </div>

    </Card>
  );
}
