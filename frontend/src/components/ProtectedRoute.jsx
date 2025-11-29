import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading, true/false = loaded
  const [loading, setLoading] = useState(true);
  const { user } = useAppContext();

  useEffect(() => {
    axios.get("http://localhost:5000/api/check-session", { withCredentials: true })
      .then((res) => {
        setAuth(res.data.logged_in);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Session check failed:", err);
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div><span className="loader"></span></div>; // Optional: spinner or placeholder

  return auth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
