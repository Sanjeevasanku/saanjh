import React from 'react'
import Logo from "../Assets/Logo.svg";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PatientDetails(props) {
    const [patientData, setPatientData] = useState()
    // const [patientId, setPatientId] = useState(props.id);
    const [reportsDate, setReportsDate] = useState(null)
    const [isOpen, setIsOPen] = useState(false)
    const [openResult, setOpenResult] = useState(false);
    const [isValid, setIsValid] = useState(null);

    const { id } = useParams();
    // const [file, setFile] = useState


    async function GetPatient() {
        console.log('inside get patient')
        const response = await axios.get(`/en/getpatient?id=${id}`);
        console.log(response.data)
        console.log(response.data.reportList)
        setPatientData(response.data);
    }

    async function getDates() {
        console.log("hi")
        const response = await axios.get(`/en/getdates?id=${id}`);
        console.log(response.data)
        setReportsDate(response.data)
    }

    useEffect(() => {
        GetPatient();
        getDates();
    }, [id]);

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);

        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    // navigate(`/caretakeranalysis/${file}`)

    const handlePatient = async (file) => {
        try {
            if (props.isDoctor) {
                navigate(`/doctoranalysis/${file}`, { state: { id: file, pid: id, isDoctor: props.isDoctor, patientData: patientData } })
            }
            else {
                navigate(`/caretakeranalysis/${file}`, { state: { id: file, pid: id, isDoctor: props.isDoctor, patientData: patientData } })
            }

        }
        catch (error) {

        }
    }

    const handleFile = async (event) => {
        setIsOPen(true);
        const selectedFile = event.target.files[0];


        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const fileData = reader.result.split(',')[1]; // Get base64-encoded file data
                const filename = event.target.value.replace("C:\\fakepath\\", "");

                try {
                    console.log("hi");
                    const reponse = await axios.post('/en/uploadpdf', { file: fileData, filename: filename, patientId: id, name: patientData.name });
                    if (reponse.data.data === false) {

                        setIsOPen(false);
                        setIsValid(true);
                        setOpenResult(true);
                    }
                    else {

                        setIsOPen(false);
                        setIsValid(false);
                        setOpenResult(true);
                    }
                    alert("Pdf uploaded successfully.")

                } catch (error) {
                    console.log("Error uploading details:", error);
                    setIsOPen(false);
                    alert('File size too large or other issues.');
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            console.log("No input file");
        }
    };


    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleFileClick = async (file) => {
        navigate(`/caretakeranalysis/${file}`)
    };

    const handleFileDClick = async (file) => {
        navigate(`/doctoranalysis/${file}`)
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/");
        }
    };


    return (

        <div>
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
            <div className="details">
                <header className="details-header">
                    <h1>Patient Details</h1>
                </header>
                {/* <div>
                    <button onClick={handleBack}>
                        Back
                    </button>
                </div> */}
                <main class="details-main">
                    {patientData ? (
                        <section className="d-patientData-details">
                            <h2 className="d-h2">Patient Information</h2>
                            <p className="d-p"><strong>Id:</strong>{patientData._id}</p>
                            <p className="d-p"><strong>Name:</strong> {patientData.name}</p>
                            <p className="d-p"><strong>Phone Number:</strong> {patientData.phoneNumber}</p>
                            <p className="d-p"><strong>Date of Birth:</strong> {formatDate(patientData.birthDate)}</p>
                            <p className="d-p"><strong>Gender:</strong> {patientData.gender}</p>
                            <p className="d-p"><strong>Blood group:</strong> {patientData.bloodGroup}</p>
                            <p className="d-p"><strong>Chronics:</strong>{patientData.chronics.map((condition, index) => (
                                <span key={index} >
                                    {` ${condition},`}
                                </span>
                            ))}</p>
                        </section>
                    ) : (
                        <p>Loading patient details...</p>
                    )}
                    {/* <section className="d-predicted-risks">
                        <h2 class="d-h2">Predicted Risks</h2>
                        <ul class="d-ul"> */}
                    {/* {patientData.predictedRisks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                        ))} */}
                    {/* </ul>
                    </section>
                    <section className="d-recommended-treatment">
                        <h2 class="d-h2">Recommended Treatment</h2>
                        <ul class="d-ul"> */}
                    {/* {patientData.recommendedTreatment.map((treatment, index) => (
                            <li key={index}>{treatment}</li>
                        ))} */}
                    {/* </ul>
                    </section> */}





                    <div className="file-upload-container">

                        {!props.isDoctor ?
                            (
                                <><label htmlFor="file-upload" className="file-upload-label">
                                    Upload Reports
                                </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFile}
                                    />
                                </>
                            ) : (<></>)}

                        <h2 >
                            Report History
                        </h2>
                    </div>

                    {/* <div>
                        {patientData?.reportsList && patientData.reportsList.length > 0 ? (
                            patientData.reportsList.map((file, index) => (
                                <div key={index}
                                    className="file-item"
                                    // style={{
                                    //     backgroundColor: '#e9ecef',
                                    //     color: '#495057',
                                    //     padding: '8px',
                                    //     borderRadius: '5px',
                                    //     margin: '8px 0',
                                    //     cursor: 'pointer',
                                    //     display: 'flex',
                                    //     alignItems: 'center'
                                    // }}
                                    onClick={() => handlePatient(file)}>

                                    <i className="fas fa-file-alt" style={{ fontSize: '20px', color: '#e74c3c', marginRight: '10px' }} />
                                    <p>File ID: {file}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reports found.</p>
                        )}
                    </div> */}

                    <div>
                        {reportsDate ? reportsDate.map((report, index) => (
                            //   <div onClick={() => { handlePatient(report.file) }} key={index} className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between cursor-pointer hover:bg-slate-100 hover:scale-105 transition transform duration-300">
                            <div key={index} onClick={() => handlePatient(report.file)} className="file-item">
                                <div>
                                    <div >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#0d151c] text-base font-medium leading-normal line-clamp-1">{report.date}</p>
                                        <p className="text-[#49779c] text-sm font-normal leading-normal line-clamp-2">{report.specialistReq}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )) : <p>No reports found.</p>}
                    </div>







                </main>
            </div>
        </div>
    )
}