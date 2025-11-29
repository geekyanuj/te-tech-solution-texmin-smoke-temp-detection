import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap"; // import Spinner


export default function ConfigureThresholdTemp({onUpdate}) {
  
 


  return (
    <div className="d-flex flex-column align-items-center mt-2">
      <span>Threshold Temperature (°C)</span>
      

      {/* Display the live threshold temperature near the button */}
      <div className="mt-2">
        <span>Live Threshold Temperature: 44</span>
      </div>

      {/* Update Button */}
      <div className="mt-3">
        <Button variant="primary" >
          Update Threshold Temperature
        </Button>
      </div>
    </div>
  );
}
