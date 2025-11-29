import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function LiveCamStream() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Idle");
  const [lastDetection, setLastDetection] = useState(0);
  const cooldown = 5000; // 5 seconds

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Could not access webcam:", err);
        setStatus("Webcam permission denied or not available");
      }
    })();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const captureBlob = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    if (!video) return null;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  };

  const recognize = async () => {
    try {
      const now = Date.now();
      if (now - lastDetection < cooldown) return;

      const blob = await captureBlob();
      if (!blob) return;
      const form = new FormData();
      form.append("image", new File([blob], "frame.jpg", { type: "image/jpeg" }));

      const r = await fetch(`${API_BASE}/face/recognize`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await r.json();

      if (!data) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data?.boxes) {
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 3;
          ctx.font = "16px Arial";
          ctx.fillStyle = "lime";

          data.boxes.forEach((b, i) => {
            const [top, right, bottom, left] = b;
            const scaleX = canvas.width / video.videoWidth;
            const scaleY = canvas.height / video.videoHeight;

            const x = left * scaleX;
            const y = top * scaleY;
            const w = (right - left) * scaleX;
            const h = (bottom - top) * scaleY;

            ctx.strokeRect(x, y, w, h);
            const label = data.matches?.[i]?.name || "Unknown";
            ctx.fillText(label, x + 5, y - 5);
          });
        }
      }

      // Speak the message
      if (data?.message) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(data.message);
        synth.speak(utter);
        setStatus(data.message);
      }

      setLastDetection(now);
    } catch (e) {
      console.error(e);
      setStatus("Recognition error");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(recognize, 1000); // check every second
    return () => clearInterval(intervalId);
  }, [lastDetection]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          borderRadius: 12,
        }}
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 8,
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    </div>
  );
}
