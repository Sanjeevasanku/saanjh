import React from 'react'
import Logo from "../Assets/Logo.svg";
import { useNavigate } from 'react-router-dom';

const patientlist = [
    {
        p_id: "22BD1A057D",
        s_no: 1,
        name: "Sanjana Pendem",
        age: 20,
        phone_no: 9390131295,
        blood_group: "B+",
        gender: "Female",

    },
    {
        p_id: "22BD1A057V",
        s_no: 2,
        name: "Hrishita",
        age: 22,
        phone_no: 8333063450,
        blood_group: "O+",
        gender: "Female",

    },
    {
        p_id: "22BD1A0574",
        s_no: 3,
        name: "Keerthika Meka",
        age: 22,
        phone_no: 8125856582,
        blood_group: "A+",
        gender: "Female",

    },
    {
        p_id: "22BD1A054A",
        s_no: 4,
        name: "Bhavana Chebrolu",
        age: 20,
        phone_no: 7013954188,
        blood_group: "A-",
        gender: "Female",

    },
];


const Doctor = () => {

    const navigate = useNavigate();

    const handleClick = () =>{
        navigate('/patientdetails');
    }

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
                {/* <div className="doctor-add-patient">
                    <button>
                        Add new patient
                    </button>
                </div> */}
                <div className='d-table-container' >
                    <table className='d-table' >
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Patient-ID</th>
                                <th>Age</th>
                                <th>Phone No.</th>
                                <th>Blood Group</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody onClick={handleClick}>
                            {patientlist.map((data) => (
                                <tr key={data.p_id} >
                                    <th>{data.s_no}</th>
                                    <td>{data.name}</td>
                                    <td>{data.p_id}</td>
                                    <td>{data.age}</td>
                                    <td>{data.phone_no}</td>
                                    <td>{data.blood_group}</td>
                                    <td>{data.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </body>
        </div>
    )
}

export default Doctor;
