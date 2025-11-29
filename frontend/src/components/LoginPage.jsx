import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAppContext();

    const handleLogin = () => {
        if (username && password) {
            console.log("Logging in with:", { username, password });

            axios.post('http://localhost:5000/api/login',
                {
                    username: username,
                    password: password
                },
                {
                    withCredentials: true, // Important to allow session cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(res => {
                    console.log('Logged in!', res.data);
                    setUser(username);         // Set user context or state
                    navigate("/dashboard");    // Redirect to dashboard
                    console.log("navigated to dashboard");

                })
                .catch(err => {
                    console.error('Login failed', err.response?.data || err.message);
                    alert('Login failed. Please check your credentials.');
                });

        } else {
            alert("Please enter both username and password.");
        }
    };

    useEffect(() => {
        document.title = "Login | Texmin";
    }, []);


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 vw-100" style={{ backgroundColor: '#dff6f5' }}>
            <div className="d-flex w-50 rounded-4 shadow-lg overflow-hidden" style={{ backgroundColor: '#c2f5f9' }}>
                {/* Left Logo Section */}
                <div className="d-flex justify-content-center align-items-center bg-white rounded-4 p-4 w-50">
                    <div className="row">
                        <img
                            src="/logo.png" //TEXMiN logo
                            alt="TEXMiN Logo"
                            className="img-fluid"
                        />
                        <div className="pt-4 ">
                            <img
                                src="/tetech-logo.png"
                                alt="tetech-logo"
                                className="pb-0"
                                style={{ width: '80px', height: '80px' }}
                            />
                        </div>
                        Powered by TeTechSolution

                    </div>
                </div>

                {/* Right Login Section */}
                <div className="d-flex flex-column justify-content-center align-items-center p-4 w-50">
                    <h2 className="fw-bold mb-1">Login to your account</h2>
                    <p className="small mb-4">
                        Don't have an account?{' '}
                        <a href="#" className="text-primary">Sign up</a>
                    </p>

                    {/* Username */}
                    <input
                        type="text"
                        placeholder="User Name"
                        className="form-control rounded-pill mb-3"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control rounded-pill mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Remember me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center w-100 mb-4 small">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Remind me
                            </label>
                        </div>
                        <a href="#" className="text-primary">Forgot Password?</a>
                    </div>

                    {/* Login Button */}
                    <button
                        className="btn w-100"
                        style={{ backgroundColor: '#3498ff', color: 'white' }}
                        onClick={handleLogin}
                    >Login</button>
                </div>
            </div>
        </div>
    );
}