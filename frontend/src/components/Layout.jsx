import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import '../assets/custom.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from "../context/AppContext";
import DateTimeView from "./DateTimeView";


export default function Layout() {

    const navigate = useNavigate();
    const { setUser } = useAppContext();


    const handleLogout = () => {
        axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true })
            .then(res => {
                console.log('Logged out:', res.data);
                // Optional: clear user context or state
                setUser(null); // Or however you're tracking logged-in user
                navigate('/');
            })
            .catch(err => {
                console.error('Logout failed:', err);
                alert('Failed to logout.');
            });
    };

    return (
        <Container fluid className="p-0 overflow-hidden vw-100" style={{ backgroundColor: '#E0F5F6' }}>
            {/* Header */}
            <Row className="m-0 gx-0 border-bottom bg-white" style={{ height: 70 }}>
                <Col className="d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center">
                        <img src="/logo.png" alt="TEXMiN Logo" style={{ height: 50, marginRight: 10 }} />
                    </div>
                    <h5 className="fw-bold m-0 flex-grow-1 ps-4">DASHBOARD</h5>
                    <div className="d-flex gap-2">
                        <DateTimeView/>
                    </div>
                    {/* Logout Button */}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleLogout}
                        style={{ padding: '6px 12px', marginLeft:'5px' }}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>

            {/* Body Layout */}
            <div className="d-flex m-0" style={{ height: "calc(100vh - 70px)", width: "100%" }}>
                {/* Sidebar */}
                <aside
                    className="border-end p-3 d-flex flex-column"
                    style={{ width: 240, flex: "0 0 240px", backgroundColor: '#E0F5F6' }}
                >

                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `btn w-100 mb-3 ${isActive ? 'custom-active' : 'btn-light'}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/dashboard/face"
                        className={({ isActive }) =>
                            `btn w-100 mb-3 ${isActive ? 'custom-active' : 'btn-light'}`
                        }
                    >
                        Face Detection
                    </NavLink>

                    <NavLink
                        to="/dashboard/thermal"
                        className={({ isActive }) =>
                            `btn w-100 mb-3 ${isActive ? 'custom-active' : 'btn-light'}`
                        }
                    >
                        Thermal Detection
                    </NavLink>

                    <NavLink
                        to="/dashboard/fire"
                        className={({ isActive }) =>
                            `btn w-100 mb-3 ${isActive ? 'custom-active' : 'btn-light'}`
                        }
                    >
                        Fire Detection
                    </NavLink>

                    <div className="mt-auto small text-center">
                        <img src="/tetech-logo.png" alt="TeTech Logo" style={{ height: 50, marginRight: 10 }} />
                        <br/>Powered by TE Techsolution
                    </div>
                </aside>

                {/* Main Content (changes based on route) */}
                <main className="p-3 overflow-auto flex-grow-1" style={{ minWidth: 0 }}>
                    <Outlet />
                </main>
            </div>
        </Container>
    );
}