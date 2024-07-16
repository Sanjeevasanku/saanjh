import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = ({setIsDoctor}) => {
    const [userRole, setUserRole] = useState("");
    // const [isDoctor, setIsDoctor] = useState("");
    const navigate = useNavigate();

    const handleValueChange = (event) => {
        const role = event.target.value;
        setUserRole(role);
        setIsDoctor(role === 'doctor');
    };

    const handleSignIn = () => {
        if (userRole==="doctor") {
          navigate("/doctor");
        } 
        else if(userRole==="caretaker"){
            navigate("/caretaker");
        }
        else {
          alert("Please select a role before signing in.");
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
                <form>
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