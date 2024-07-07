import React from 'react'
import Logo from "../Assets/Logo.svg";
import { useState } from 'react';
import axios from 'axios'

const AddPatient = () => {
    

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        gender: "",
        bloodGroup: "",
        file: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const response = await axios.post("/en/uploadpatient", formData);
        const data=response.data;
        alert(data)

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
            <div className='ap'>
                <body>
                    <section className="ap-container">
                        <header>Patient Registration Form</header>
                        <form action="#" className="ap-form" onSubmit={handleSubmit}>
                            <div className="ap-input-box">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ap-input-box">
                                <label>Email Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter email address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ap-column">
                                <div className="ap-input-box">
                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        placeholder="Enter phone number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ap-input-box">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        placeholder="Enter birth date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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

                            <button>Submit</button>
                        </form>
                    </section>
                </body>
            </div>
        </div>
    )
}

export default AddPatient
