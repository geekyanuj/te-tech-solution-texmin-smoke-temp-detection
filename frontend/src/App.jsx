import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FaceDetection from "./pages/FaceDetection";
import ThermalDetection from "./pages/ThermalDetection";
import FireDetection from "./pages/FireDetection";
import { MqttProvider } from "./context/MqqtContext";

function App() {
  return (
    <MqttProvider>
    <Router>
      <Routes>
        {/* Login page at root */}
        <Route path="/" element={<LoginPage />} />

        {/* All dashboard-related pages wrapped in Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="face" element={<FaceDetection />} />
          <Route path="thermal" element={<ThermalDetection />} />
          <Route path="fire" element={<FireDetection />} />
        </Route>
      </Routes>
    </Router>
    </MqttProvider>
  );
}

export default App;
