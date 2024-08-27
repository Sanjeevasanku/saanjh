import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
function Newuser() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState("");
    // const [isDoctor, setIsDoctor] = useState("");
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/en/newuser', { email, name, userRole });
            setMessage('Signup successful! Please check your email to set your password.');
            // Redirect to login page
        } catch (error) {
            setMessage('An error occurred.');
            console.error('Error:', error);
        }
    };

    const handleValueChange = (event) => {
        const role = event.target.value;
        setUserRole(role);
        // setIsDoctor(role === 'doctor');
    };

    return (
        <div>
            <Navbar />
            <div className="login">
                <div className="login-container">

                    {/* <h3 style={{ marginTop: '6%' }}>Signup</h3> */}
                    <div className="login-header">
                        <div className="login-icon">👵👴</div>
                        <h2>Saanjh</h2>
                        <p>Signup</p>
                    </div>
                    <div >
                        <div className="input-group">
                            <label for="name">Name</label>
                            <input
                                type="text"
                                // id="username"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                            />
                        </div>
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
                        <button className="login-btn" onClick={handleSubmit}>
                            Signup
                        </button>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newuser;
