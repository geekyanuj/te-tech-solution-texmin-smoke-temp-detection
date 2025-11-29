import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap"; // import Spinner
import { MqttContext } from "../context/MqqtContext";

const topicThresholdTempSet = "home/threshold/temp/set"; // Topic for setting threshold temperature
const topicThresholdTemp = "home/threshold/temp"; // Topic for getting the current threshold temperature

export default function ConfigureThresholdTemp({onUpdate}) {
  const { subscribeToTopic, publish } = useContext(MqttContext);
  const [thresholdTemp, setThresholdTemp] = useState(30); // Default to 30°C
  const [thresholdTempFromESP, setThresholdTempFromESP] = useState(null);
  const [esp32Connected, setEsp32Connected] = useState(false); // Internal state for ESP32 connection status

  useEffect(() => {
    const unsubThresholdTemp = subscribeToTopic(topicThresholdTemp, (msg) => {
      const temp = parseInt(msg);
      if (!isNaN(temp)) {
        setThresholdTempFromESP(temp);
        setEsp32Connected(true); // Set connected when data arrives
      }
    });

    // Request the current threshold temperature on mount
    publish(topicThresholdTemp, "get"); // Request the current threshold temperature

    // Check for connection status by timing out if no data received for 5 seconds
    const timeout = setTimeout(() => {
      if (thresholdTempFromESP === null) {
        setEsp32Connected(false); // ESP32 is considered disconnected
      }
    }, 5000);

    return () => {
      unsubThresholdTemp();
      clearTimeout(timeout);
    };
  }, [subscribeToTopic, publish, thresholdTempFromESP]);

  const handleTempChange = (e) => {
    const newTemp = e.target.value;
    setThresholdTemp(newTemp);
  };

  const updateThresholdTemp = () => {
    publish(topicThresholdTempSet, thresholdTemp.toString()); // Publish the new threshold temperature
    alert('Updated');
     if (onUpdate) onUpdate(); // Call the passed callback to close modal
  };

  return (
    <div className="d-flex flex-column align-items-center mt-2">
      <span>Threshold Temperature (°C)</span>
      <Form.Control
        as="select"
        value={thresholdTemp}
        onChange={handleTempChange}
        disabled={!esp32Connected} // Only enable when ESP32 is connected
        className="w-25"
      >
        {[...Array(31)].map((_, i) => (
          <option key={i} value={i + 15}>
            {i + 15}
          </option>
        ))}
      </Form.Control>

      {/* Display the live threshold temperature near the button */}
      <div className="mt-2">
        <span>Live Threshold Temperature: {thresholdTempFromESP !== null ? `${thresholdTempFromESP}°C` : "Loading..."}</span>
      </div>

      {/* Update Button */}
      <div className="mt-3">
        <Button variant="primary" onClick={updateThresholdTemp} disabled={!esp32Connected}>
          Update Threshold Temperature
        </Button>
      </div>

      {/* Display Connection Status or Loader */}
      <div className="mt-2">
        {!esp32Connected && thresholdTempFromESP === null ? (
          // Show loader while waiting for connection
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
