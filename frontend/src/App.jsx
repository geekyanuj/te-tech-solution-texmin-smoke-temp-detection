import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ThermalDetection from "./pages/ThermalDetection";
import FireDetection from "./pages/FireDetection";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page at root */}
        <Route path="/" element={<LoginPage />} />

        {/* All dashboard-related pages wrapped in Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="thermal" element={<ThermalDetection />} />
          <Route path="fire" element={<FireDetection />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
