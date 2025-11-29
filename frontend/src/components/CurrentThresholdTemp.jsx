// CurrentThresholdTemp.js
import React, { useContext, useEffect, useState } from "react";
import { MqttContext } from "../context/MqqtContext";

const topicThresholdTemp = "home/threshold/temp"; // Topic for getting the current threshold temperature

export default function CurrentThresholdTemp() {
  const { subscribeToTopic } = useContext(MqttContext);
  const [thresholdTempFromESP, setThresholdTempFromESP] = useState(null);

  useEffect(() => {
    const unsubThresholdTemp = subscribeToTopic(topicThresholdTemp, (msg) => {
      const temp = parseInt(msg);
      if (!isNaN(temp)) {
        setThresholdTempFromESP(temp);
      }
    });

    return () => {
      unsubThresholdTemp(); // Clean up subscription on unmount
    };
  }, [subscribeToTopic]);

  return (
    <div className="mt-2">
      <span>Live Threshold Temperature: {thresholdTempFromESP !== null ? `${thresholdTempFromESP}°C` : "Loading..."}</span>
    </div>
  );
}
