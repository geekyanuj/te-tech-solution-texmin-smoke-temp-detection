// VentSwitch.js
import React, { useContext, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { TbAlarmSmoke } from "react-icons/tb";


export default function VentSwitch() {
  const [mode, setMode] = useState(null);
  const [isTogglingMode, setIsTogglingMode] = useState(false);



  const toggleMode = () => {
    if (!mode || isTogglingMode) return;
    setIsTogglingMode(true);
    setMode(newMode);
    setTimeout(() => {
      setIsTogglingMode(false);
    }, 3000);
  };

  const isModeManual = mode === "manual";

  return (
    <Card className="text-center p-3 h-100" style={{ backgroundColor: "#C3FFFF" }}>
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "30%",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        ></div>
        <TbAlarmSmoke size={30} style={{ color: "#fb4b00ff" }} />
      </div>

      <div className="d-flex justify-content-between align-items-center w-100 mt-2">
        <span>Ventilation Mode</span>
        <Form.Check
          type="switch"
          checked={isModeManual}
          onChange={toggleMode}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center w-100 mt-2">
        <span>Vent Relay</span>
        <Form.Check
          type="switch"
        />
      </div>

    </Card>
  );
}
