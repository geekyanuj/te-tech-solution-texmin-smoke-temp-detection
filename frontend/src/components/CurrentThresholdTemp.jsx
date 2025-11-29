// CurrentThresholdTemp.js
import React, { useContext, useEffect, useState } from "react";

const topicThresholdTemp = "home/threshold/temp"; // Topic for getting the current threshold temperature

export default function CurrentThresholdTemp() {
  const [thresholdTempFromESP, setThresholdTempFromESP] = useState(null);

 

  return (
    <div className="mt-2">
      <span>Live Threshold Temperature: {thresholdTempFromESP !== null ? `${thresholdTempFromESP}°C` : "Loading..."}</span>
    </div>
  );
}
