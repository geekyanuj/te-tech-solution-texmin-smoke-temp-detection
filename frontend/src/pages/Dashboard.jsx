import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { MdEdgesensorHigh } from "react-icons/md";
import "../assets/custom.css";
import SmokerSwitch from "../components/SmokerSwitch";
import VentSwitch from "../components/VentSwitch";
import LiveTemperatureCard from "../components/LiveTemperatureCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Dashboard() {



  useEffect(() => {
    document.title = "Dashboard | Texmin";
  }, []);

  return (
    <Container fluid className="p-0 overflow-hidden" style={{ backgroundColor: "#E0F5F6" }}>
      <div className="d-flex m-0" style={{ width: "100%" }}>
        <main className="p-3 overflow-auto flex-grow-1" style={{ minWidth: 0 }}>
          <Row className="g-3">
            <Col md={6} className="bg-secondary d-flex justify-content-center align-items-center" style={{ height: 300 }}>
            </Col>

            <Col md={6}>
              <Row className="g-3">
                <Col sm={6}>
                  <Card className="text-center p-3" style={{ backgroundColor: "#C3FFFF" }}>
                    <MdEdgesensorHigh size={30} style={{ color: "#fb4b00ff" }} />
                    <h3 className="m-0">2</h3>
                    <p className="mb-0">Total Sensors</p>
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
            
          </Row>
        </main>
      </div>
    </Container>
  );
}
