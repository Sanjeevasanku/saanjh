import React from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.svg";
import { useEffect, useState } from 'react';
import axios from 'axios';

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

    const handlePatientClick = (id) =>{
        navigate(`/patientdetails/${id}`);
    }   


    const[patientlist, setPatientlist]=useState(null)

    useEffect(()=>{
        const function1 = async() => {
            const response=await axios.get("/en/getpatients")
            setPatientlist(response.data);
        }
        function1();
    },[])

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
                                <th>Email</th>
                                <th>Phone No.</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientlist && patientlist.map((data) => (
                                <tr key={data._id}  onClick={() => handlePatientClick(data._id)} >
                                    {/* <th>{data.s_no}</th> */}
                                    <td>{data._id}</td>
                                    <td>{data.fullName}</td>
                                    <td>{data.email}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td>{data.birthDate}</td>
                                    <td>{data.gender}</td>
                                    <td>{data.bloodGroup}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </body>
        </div>
    )
}

export default Caretaker
