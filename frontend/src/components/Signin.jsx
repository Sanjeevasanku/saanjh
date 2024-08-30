import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Signin = ({ setIsDoctor }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setUserRole] = useState("");
    // const [isDoctor, setIsDoctor] = useState("");
    // const [data, setData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState('');
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // const handleChange = ({ currentTarget: input }) => {
    //     setData({ ...data, [input.name]: input.value });
    // };

    const handleValueChange = (event) => {
        const urole = event.target.value;
        setUserRole(urole);
        setIsDoctor(urole === 'doctor');
    };

    const handleSignIn = async () => {
        try {
            const response = await axios.post('/en/login', { email, password, role });
            if (response.status === 200) {
                setMessage('Login successful!');
                if (role === "doctor") {
                    navigate("/doctor");
                }
                else if (role === "caretaker") {
                    navigate("/caretaker");
                }
            }
            else {
                // alert("Please select a role before signing in.");
                setMessage('Login failed, please check your credentials.');
            }
        }
        catch (error) {
            setMessage('An error occurred.');
            console.error('Error:', error);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const url = "/login";
    //         const { data: res } = await axios.post(url, data);
    //         localStorage.setItem("token", res.data);
    //         navigate("/details");
    //         // window.location='/';

    //     } catch (error) {
    //         if (error.response && error.response.status >= 400 && error.response.status <= 500) {
    //             setError(error.response.data.message);
    //         }
    //     }
    // };

    const linkStyle = {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline'
    };

    return (
        <div>
            <Navbar />
            <div className="login">
                <div className="login-container">
                    <div className="login-header">
                        <div className="login-icon">👵👴</div>
                        <h2>Saanjh</h2>
                        <p>Elderly Care Health Tracking System</p>
                    </div>
                    <div
                    // onSubmit={handleSubmit}
                    >
                        <div className="input-group">
                            <label for="email">Email</label>
                            <input
                                type="text"
                                id="username"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label for="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <div className="l-user-type">
                            <label>
                                <input
                                    type="radio"
                                    name="user-type"
                                    value="doctor"
                                    checked={role === "doctor"}
                                    onChange={handleValueChange}
                                />
                                <span>Doctor</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="user-type"
                                    value="caretaker"
                                    checked={role === "caretaker"}
                                    onChange={handleValueChange}
                                />
                                <span>Caretaker</span>
                            </label>
                        </div>
                        <button type="submit" className="login-btn" onClick={handleSignIn}>Enter System</button>

                        <p>
                            Don't have an account?
                            <span style={linkStyle} onClick={() => navigate('/newuser')}>
                                Signup here.
                            </span>
                        </p>
                        {message && <p>{message}</p>}


                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signin;