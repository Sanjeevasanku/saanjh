import React from 'react'
import Logo from "../Assets/Logo.svg";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chatbot from './Chatbot';

const Doctor = () => {

    const navigate = useNavigate();

    const handlePatientClick = (id) => {
        navigate(`/getpatientdetails/${id}`);
    }

    const [patientlist, setPatientlist] = useState(null)

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const function1 = async () => {
            const response = await axios.get("/en/getpatients")
            setPatientlist(response.data);
        }
        function1();
    }, [])

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    return (
        <div>
            <header>
                <nav className='doctor-nav'>
                    <div className="nav-logo-container">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="navbar-links-container">
                        <a href="/">Home</a>
                        <a href="">About us</a>
                        <a href="">Contact</a>
                        <button className="primary-button" onClick={handleLogout}>Logout</button>

                    </div>
                </nav>
            </header>
            <body>

                <div className='d-table-container' >
                    <table className='d-table' >
                        <thead>
                            <tr>
                                <th>Patient-ID</th>
                                <th>Name</th>
                                <th>Phone No.</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientlist && patientlist.map((data) => (
                                <tr key={data._id} onClick={() => handlePatientClick(data._id)}>
                                    <td>{data._id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td>{formatDate(data.birthDate)}</td>
                                    <td>{data.gender}</td>
                                    <td>{data.bloodGroup}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Chatbot />
            </body>
        </div>
    )
}

export default Doctor;
