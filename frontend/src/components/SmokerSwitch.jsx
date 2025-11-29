// ==== components/SmokerSwitch.jsx ====
import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { TbAlarmSmoke } from "react-icons/tb";


export default function SmokerSwitch() {



  const handleSmokeSwitch = (e) => {
    const on = e.target.checked;
  };

  return (
    <Card className="text-center p-3 h-100" style={{ backgroundColor: "#C3FFFF" }}>
      
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div
         
        ></div>
        <TbAlarmSmoke size={30} style={{ color: "#fb4b00ff" }} />
      </div>
      <div className="d-flex align-items-center gap-3">
        {/* Label and Switch */}
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <span>Smoker Switch</span>
          <Form.Check
            type="switch"
            checked={"On"}
            onChange={handleSmokeSwitch}
          />
        </div>
      </div>
    </Card>
  );
}
