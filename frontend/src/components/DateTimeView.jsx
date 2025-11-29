import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

function DateTimeView() {
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  function getFormattedTime() {
    const now = new Date();

    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return now.toLocaleString('en-US', options); // Example: "Monday, 12 Sep, 10:32:45 AM"
  }

  return (
    <div className="d-flex gap-2">
      <Form.Control
        type="text"
        value={currentTime}
        readOnly
        style={{ maxWidth: 300, minWidth:235 }}
      />
      
    </div>
  );
}

export default DateTimeView;
