// ==== components/LiveTemperatureCard.jsx (refactored to use context hook) ====
import React from "react";
import { Card } from "react-bootstrap";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { TbTemperatureCelsius } from "react-icons/tb";


export default function LiveTemperatureCard() {
  const temp = 22;

  return (
    <Card className="text-center p-3" style={{ backgroundColor: "#C3FFFF" }}>
      <LiaTemperatureHighSolid size={40} style={{ color: "#fb4b00ff" }} />
      <h3 className="m-0">
        {temp ?? "--"} <TbTemperatureCelsius />
      </h3>
      <p className="mb-0">Live Temperature</p>
    </Card>
  );
}

