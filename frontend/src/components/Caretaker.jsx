import React from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.svg";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chatbot from './Chatbot';

// const patientlist = [
//     {
//         p_id: "22BD1A057D",
//         s_no: 1,
//         name: "Sanjana Pendem",
//         age: 20,
//         phone_no: 9390131295,
//         blood_group: "B+",
//         gender: "Female",

//     },
//     {
//         p_id: "22BD1A057V",
//         s_no: 2,
//         name: "Hrishita",
//         age: 22,
//         phone_no: 8333063450,
//         blood_group: "O+",
//         gender: "Female",

//     },
//     {
//         p_id: "22BD1A0574",
//         s_no: 3,
//         name: "Keerthika Meka",
//         age: 22,
//         phone_no: 8125856582,
//         blood_group: "A+",
//         gender: "Female",

//     },
//     {
//         p_id: "22BD1A054A",
//         s_no: 4,
//         name: "Bhavana Chebrolu",
//         age: 20,
//         phone_no: 7013954188,
//         blood_group: "A-",
//         gender: "Female",

//     },
// ];



const Caretaker = () => {
    const navigate = useNavigate();

    const handleClickAddPatient = () => {
        navigate('/addpatient');
    };

    const handlePatientClick = (id) => {
        navigate(`/getpatientdetails/${id}`);
    }

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [patientlist, setPatientlist] = useState(null)

    useEffect(() => {
        const function1 = async () => {
            // console.log("entered")
            const response = await axios.get("/en/getpatients")
            // console.log(response.data)
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
                <div className="doctor-add-patient">
                    <button onClick={handleClickAddPatient}>
                        Add new patient
                    </button>
                </div>
                <div className='d-table-container' >
                    <table className='d-table' >
                        <thead>
                            <tr>
                                {/* <th>S.No</th> */}
                                <th>Patient-ID</th>
                                <th>Name</th>
                                {/* <th>Email</th> */}
                                <th>Phone No.</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientlist && patientlist.map((data) => (
                                <tr key={data._id} onClick={() => handlePatientClick(data._id)} >
                                    {/* <th>{data.s_no}</th> */}
                                    <td>{data._id}</td>
                                    <td>{data.name}</td>
                                    {/* <td>{data.email}</td> */}
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

export default Caretaker
