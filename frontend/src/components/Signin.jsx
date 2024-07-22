import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = ({ setIsDoctor }) => {
    const [userRole, setUserRole] = useState("");
    // const [isDoctor, setIsDoctor] = useState("");
    const [data, setData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleValueChange = (event) => {
        const role = event.target.value;
        setUserRole(role);
        setIsDoctor(role === 'doctor');
    };

    const handleSignIn = () => {
        if (userRole === "doctor") {
            navigate("/doctor");
        }
        else if (userRole === "caretaker") {
            navigate("/caretaker");
        }
        else {
            alert("Please select a role before signing in.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "/login";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            navigate("/details");
            // window.location='/';

        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-icon">👵👴</div>
                    <h2>Saanjh</h2>
                    <p>Elderly Care Health Tracking System</p>
                </div>
                <form 
                // onSubmit={handleSubmit}
                >
                    {/* <div className="input-group">
                        <label for="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                        />
                    </div> */}
                    <div className="l-user-type">
                        <label>
                            <input
                                type="radio"
                                name="user-type"
                                value="doctor"
                                checked={userRole === "doctor"}
                                onChange={handleValueChange}
                            />
                            <span>Doctor</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="user-type"
                                value="caretaker"
                                checked={userRole === "caretaker"}
                                onChange={handleValueChange}
                            />
                            <span>Caretaker</span>
                        </label>
                    </div>
                    <button type="submit" className="login-btn" onClick={handleSignIn}>Enter System</button>
                </form>
            </div>
        </div>
    )
}
export default Signin;