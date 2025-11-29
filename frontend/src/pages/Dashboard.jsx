import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { LiaSignInAltSolid } from "react-icons/lia";
import "../assets/custom.css";
import SmokerSwitch from "../components/SmokerSwitch";
import VentSwitch from "../components/VentSwitch";
import LiveTemperatureCard from "../components/LiveTemperatureCard";
import LiveCamStream from "../components/LiveCamStream";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function Dashboard() {
  const { user } = useAppContext();
  const [recentPeople, setRecentPeople] = useState([]);
  const [totalPersons, setTotalPersons] = useState(0);


  useEffect(() => {
    document.title = "Dashboard | Texmin";

    const fetchRecentPeople = async () => {
      try {
        const res = await fetch(`${API_BASE}/face/entries?page=1&limit=4`);
        const data = await res.json();
        setRecentPeople(data.data || []);
      } catch (err) {
        console.error("Failed to fetch recent entries:", err);
      }
    };

    fetchRecentPeople(); // initial fetch
    const interval = setInterval(fetchRecentPeople, 5000); // refresh every 5s


    /*-----------------fetch total person function----------------------*/
    const fetchTotalPersons = async () => {
    try {
      const res = await fetch(`${API_BASE}/face/persons`);
      const data = await res.json();
      setTotalPersons(data.length || 0);
    } catch (err) {
      console.error("Failed to fetch total persons:", err);
    }
  };

  fetchTotalPersons(); // initial fetch


    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <Container fluid className="p-0 overflow-hidden" style={{ backgroundColor: "#E0F5F6" }}>
      <div className="d-flex m-0" style={{ width: "100%" }}>
        <main className="p-3 overflow-auto flex-grow-1" style={{ minWidth: 0 }}>
          <Row className="g-3">
            <Col md={6} className="bg-secondary d-flex justify-content-center align-items-center" style={{ height: 300 }}>
              <LiveCamStream/>
            </Col>

            <Col md={6}>
              <Row className="g-3">
                <Col sm={6}>
                  <Card className="text-center p-3" style={{ backgroundColor: "#C3FFFF" }}>
                    <LiaSignInAltSolid size={40} style={{ color: "#fb4b00ff" }} />
                    <h3 className="m-0">{totalPersons}</h3>
                    <p className="mb-0">Total Registered People</p>
                  </Card>
                </Col>
                <Col sm={6}>
                  <LiveTemperatureCard />
                </Col>
                <Col sm={6}>
                  <SmokerSwitch />
                </Col>
                <Col sm={6}>
                  <VentSwitch />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Recent People Section */}
          <div className="mt-3 p-2 bg-secondary text-white fw-bold">Most Recent People Entered</div>

          <Row className="mt-2 g-3">
            {recentPeople.map((entry) => (
              <Col key={entry.entry_id} xs={6} md={3}>
                <Card className="text-center p-2" style={{ height: 180, backgroundColor: "#C3FFFF" }}>
                  <div className="d-flex justify-content-center mt-2">
                    <img
                      src={`${API_BASE.replace("/api", "")}/${entry.person.image_path}`}
                      alt={entry.person.name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #007bff"
                      }}
                    />
                  </div>
                  <h6 className="mt-2 mb-0">{entry.person.name}</h6>
                  <small className="text-muted">({entry.person.designation})</small>
                  <p className="mt-1 mb-0" style={{ fontSize: "0.8rem" }}>
                    {new Date(entry.timestamp).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    </Container>
  );
}
