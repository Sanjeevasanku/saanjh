import React from 'react'
import Logo from "../Assets/Logo.svg";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPatient = () => {


    const [currentChronic, setCurrentChronic] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        phoneNumber: '',
        chronics: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddChronic = () => {
        if (currentChronic.trim() !== '') {
            setFormData(prevData => ({
                ...prevData,
                chronics: [...prevData.chronics, currentChronic.trim()]
            }));
            setCurrentChronic('');
        }
    };

    const handleRemoveChronic = (index) => {
        setFormData(prevData => ({
            ...prevData,
            chronics: prevData.chronics.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        const formDataToSend = {
            ...formData,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
        };

        const response = await axios.post("/en/setpatient", formDataToSend);
        console.log(response.data.data);
        setFormData({
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            gender: '',
            bloodGroup: '',
            phoneNumber: '',
            chronics: [],
        });
        alert('Form data submitted successfully!');
        navigate(-1);

        // const data = new FormData();
        // for(const key in formData){
        //     data.append(key, formData[key]);
        // }

        // try{
        //     const response = await axios.post("/en/addpatient", data, {
        //         headers: {
        //             'Content-Type' : 'multipart/form-data'
        //         }
        //     });
        //     alert("Patient added successfully!");
        //     console.log(response.data);
        // }catch(err){
        //     console.error("Error submitting form: ",err);
        // }

        // console.log(formData);
    };

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
            <div className='ap'>
                <body>
                    <section className="ap-container">
                        <header>Patient Registration Form</header>
                        <form action="#" className="ap-form" onSubmit={handleSubmit}>
                            <div className="ap-input-box">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="ap-input-box">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="ap-column">
                                <div className="ap-input-box">
                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        placeholder="Phone number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="ap-input-box">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        placeholder="Enter birth date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="ap-gender-box">
                                <h3>Gender</h3>
                                <div className="ap-gender-option">
                                    <div className="ap-gender">
                                        <input
                                            type="radio"
                                            id="check-male"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === "male"}
                                            onChange={handleInputChange}
                                        />
                                        <label for="check-male">male</label>
                                    </div>
                                    <div className="ap-gender">
                                        <input
                                            type="radio"
                                            id="check-female"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === "female"}
                                            onChange={handleInputChange}
                                        />
                                        <label for="check-female">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ap-input-box address">
                                <div className="ap-column">
                                    <div className="ap-select-box">
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option hidden>Blood Group</option>
                                            <option>O+</option>
                                            <option>A+</option>
                                            <option>B+</option>
                                            <option>AB+</option>
                                            <option>O-</option>
                                            <option>A-</option>
                                            <option>B-</option>
                                            <option>AB-</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* <input
                                type="file"
                                class="form-control"
                                accept="application/pdf"
                                required
                                // onChange={(e) => setFile(e.target.files[0])}
                                onChange={handleFileChange}
                            /> */}
                            <div className="ap-input-box">
                                <label className="ap-label">Current Chronic Conditions</label>
                                <div className="ap-chronic-input">
                                    <input
                                        type="text"
                                        value={currentChronic}
                                        onChange={(e) => setCurrentChronic(e.target.value)}
                                        className="ap-chronic-field"
                                        placeholder="Enter a chronic condition"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddChronic}
                                        className="ap-chronic-add-btn"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="app-chronic-list">
                                    {formData.chronics.map((chronic, index) => (
                                        <div key={index} className="ap-chronic-item">
                                            <span>{chronic}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveChronic(index)}
                                                className="app-chronic-remove-btn"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="ap-submit-btn">Submit</button>
                        </form>
                    </section>
                </body>
            </div>
        </div>
    )
}

export default AddPatient
