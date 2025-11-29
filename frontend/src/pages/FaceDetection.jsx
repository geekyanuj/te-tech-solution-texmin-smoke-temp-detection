import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../assets/custom.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [peopleData, setPeopleData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entryLogData, setEntryLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;


  // Load people and entry logs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const peopleRes = await fetch(`${API_BASE}/face/persons`);
        const people = await peopleRes.json();
        setPeopleData(people);

        await fetchEntryLogs(currentPage); 
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const fetchEntryLogs = async (page = 1) => {
    try {
      const res = await fetch(`${API_BASE}/face/entries?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      setEntryLogData(data.data);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  


  // Open webcam when modal opens
  useEffect(() => {
    if (!showModal) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreaming(true);
        }
      } catch (err) {
        console.error("Webcam error:", err);
        setStatus("Webcam permission denied or not available");
      }
    })();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        setStreaming(false);
        setRecognizing(false);
      }
    };
  }, [showModal]);

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

  const enroll = async () => {
    try {
      setStatus("Capturing...");
      const blob = await captureBlob();
      if (!blob) return;
      const form = new FormData();
      form.append("name", name);
      form.append("designation", designation);
      form.append("image", new File([blob], "frame.jpg", { type: "image/jpeg" }));

      const r = await fetch(`${API_BASE}/face/enroll`, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await r.json();

      if (!r.ok) {
        setStatus(data.error || "Enroll failed");
        return;
      }

      const refreshed = await fetch(`${API_BASE}/face/persons`).then((res) => res.json());
      setPeopleData(refreshed);

      setStatus("Enrolled successfully");
      setName("");
      setDesignation("");
    } catch (e) {
      console.error(e);
      setStatus("Enroll failed");
    }
  };

  const tickRecognize = async () => {
    try {
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

      if (data?.matches?.length) {
        const m = data.matches.find((m) => m.name);
        setStatus(m ? `Hello, ${m.name} (${m.designation})` : "Unknown person");
      } else {
        setStatus("No face detected");
      }
    } catch (e) {
      console.error(e);
      setStatus("Recognition error");
    }
  };

  useEffect(() => {
    if (!recognizing) return;
    const id = setInterval(tickRecognize, 1200);
    return () => clearInterval(id);
  }, [recognizing]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="row">

      <div className="p-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Register a New Person
        </Button>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Register a New Person</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex gap-3 align-items-start p-3">
              <div style={{ position: "relative", width: 480, height: 360 }}>
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
                  width={480}
                  height={360}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div className="flex-grow-1 p-3">
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={enroll}
                    disabled={!streaming || !name || !designation}
                  >
                    Enroll Face
                  </Button>
                  {/* <Button
                    variant={recognizing ? "danger" : "success"}
                    onClick={() => setRecognizing((v) => !v)}
                    disabled={!streaming}
                  >
                    {recognizing ? "Stop Recognition" : "Start Recognition"}
                  </Button> */}
                </div>
                <div className="mt-3">
                  <strong>Status:</strong> {status}
                </div>
              </div>
            </div>

            <div className="table-wrapper mt-4">
              <h5>Registered Persons</h5>
              <table className="people-table table table-bordered">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Enrolled On</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleData.map((person) => (
                    <tr key={person.id}>
                      <td>
                        <img
                          src={`${API_BASE.replace("/api", "")}/${person.image_path}`}
                          alt={person.name}
                          className="photo-cell"
                          width={40}
                          height={40}
                        />
                      </td>
                      <td><strong>{person.name}</strong></td>
                      <td>{person.designation}</td>
                      <td>
                        {person.enrolled_on
                          ? new Date(person.enrolled_on).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }).replace(",", "")
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* -----------Entry Log table---------- */}
      <h4 className="m-0 p-0">Entry Logs</h4>
      <div className="table-wrapper mt-0">
        <table className="people-table table table-bordered">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Entry Time</th>
            </tr>
          </thead>
          <tbody>
            {entryLogData.map((person) => (
              <tr key={person.entry_id}>
                <td>
                  <img
                    src={`${API_BASE.replace("/api", "")}/${person.person.image_path}`}
                    alt={person.person.name}
                    className="photo-cell"
                    width={40}
                    height={40}
                  />
                </td>
                <td><strong>{person.person.name}</strong></td>
                <td>{person.person.designation}</td>
                <td>
                  {person.timestamp
                    ? new Date(person.timestamp).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).replace(",", "")
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary mx-1"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="mx-2 align-self-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-primary mx-1"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

    </div>

  );
}
