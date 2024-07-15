import React from 'react'
// import Navigationvar from './Navigationvar'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Logo from "../Assets/Logo.svg";
import axios from 'axios';

export default function PatientDetails() {
    const [patientData, setPatientData] = useState()
    // const [patientId, setPatientId] = useState(props.id);
    const [reportsDate, setReportsDate] = useState(null)


    const { patientId } = useParams();
    // const [file, setFile] = useState

    async function GetPatient() {
        const response = await axios.get(`/en/getpatient/${patientId}`);
        setPatientData(response.data);
    }

    async function getDates() {
        console.log("hi")
        const response = await axios.get(`/en/getdates/${patientId}`);
        setReportsDate(response.data)
    }

    useEffect(() => {
        GetPatient();
        getDates();
    }, [patientId])

    // const [pdf,setPdf]=useState();
    // const handlefileupload=(e)=>
    //     {
    //         setPdf(e.target.files[0]);
    //     }
    // const submit_report=async ()=>
    //     {
    //         try{
    //             const response=await axios.get('/en/newpdf');
    //             const data=response.data;
    //             console.log(data);
    //         }
    //         catch(err)
    //         {
    //             console.log("errror occured ",err);
    //         }

    //     }
    // const patientData = [
    //     {
    //         fullName: "Sanjana Pendem",
    //         age: 20,
    //         email: "sanjana@gmail.com",
    //         phoneNumber: 9390131295,
    //         birthDate: "15-12-2004",
    //         bloodGroup: "B+",
    //         gender: "Female",

    //     },
    // ];

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    // const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];
    //     setSize
    // }

    return (
        // <div>
        //     {/* <Navigationvar/> */}
        //     <div col='container'>
        //     <div class='row'>
        //     <button class="col-sm" style={{fontSize: '25px',backgroundColor:'orange',color:'white',marginTop:'1%',marginLeft:'10%',marginRight:'10%'}}>
        //   Sanjeeva Sanku
        // </button>
        //     </div>
        //     </div>


        //    <div class='container2'>
        //     <div class='row'>
        //         <div class='col' style={{marginLeft:'20%',marginTop:'2%'}}>
        //             <h5>Patient Name : Sanjeeva Sanku</h5>
        //             <br/>

        //             <h5>Doctor Name: Stella Veronica</h5>
        //             <br/>
        //             <h5>Age : 20</h5>
        //             <br/>
        //             <h5>Gender : Female</h5>
        //             <br/>
        //             <h5>Blood Group : A+</h5>
        //             <br/>



        //         </div>
        //         <div class='col' style={{marginTop:'4%'}}>
        //             {/* <img src='./images.jpeg' style={{maxWidth: '100%', maxHeight: '100%' }}/> */}
        //         </div>
        //     </div>

        //     <div class='container2'>
        //         <div class='row'>
        //             <div class='col' style={{marginTop:'2%',marginLeft:'10%',marginRight:'10%'}}>
        //                 <h5>RECOMMENDED TREATMENT</h5>
        //                 <p style={{fontSize:'20px'}}>There are many variations of passages of Lorem Ipsum available,
        //                      but the majority have suffered alteration in some form, by injected humour, 
        //                      or randomised words which don't look even slightly believable. 
        //                      If you are going to use a passage of Lorem Ipsum, you need to be sure there 
        //                      isn't anything </p>
        //                       <button type='submit' style={{backgroundColor:'orange',color:'white'}}>ENDROSE THE TREATMENT</button>
        //             </div>
        //         </div>
        //     </div>

        //     <div class='container3'>
        //         <div class='row'>
        //             <div class='col' style={{marginTop:'5%',marginLeft:'10%'}}>
        //                 <h5>PRECRIPTION</h5>
        //                 <p style={{fontSize:'20px'}}>There are many variations of passages of Lorem Ipsum available,
        //                      but the majority have suffered alteration in some form, by injected humour, 
        //                      or randomised words which don't look even slightly believable. 
        //                      If you are going to use a passage of Lorem Ipsum, you need to be sure there 
        //                      isn't anything embarrassing hidden in the middle of text.</p>
        //                      <button type='submit' style={{backgroundColor:'orange',color:'white'}}>DOWNLOAD PRESCRIPTION</button>
        //             </div>

        //         </div>
        //     </div>



        //     <div class='container4'>
        //         <div class='row'>
        //             <div class='col'style={{marginTop:'5%',marginLeft:'10%',marginRight:'10%'}}>
        //                 <h5>DIET PLAN AND EXCERSISES</h5>
        //                 <p style={{fontSize:'20px'}}>There are many variations of passages of Lorem Ipsum available,
        //                      but the majority have suffered alteration in some form, by injected humour, 
        //                      or randomised words which don't look even slightly believable. 
        //                      If you are going to use a passage of Lorem Ipsum, you need to be sure there 
        //                      isn't anything embarrassing hidden in the middle of text.</p>
        //                 <h5>voice recording</h5>

        //             </div>
        //         </div>
        //     </div>

        //     <div class='container5'>
        //         <div class='row'>
        //             <div class='col'  style={{marginTop:'5%',marginLeft:'10%',marginRight:'10%'}}>
        //                 <h5>UPLOAD NEW REPORT</h5>
        //                 <input type='file' accept='application/pdf'/>
        //                 {/* <input type='file' accept='application/pdf' onChange={()=>{handlefileupload}}/> */}
        //                 <button type='submit' style={{backgroundColor:'orange',color:'white'}}>SUBMIT</button>
        //                 {/* <button type='submit' style={{backgroundColor:'#990011FF',color:'white'}} onClick={submit_report}>SUBMIT</button> */}

        //             </div>

        //         </div>
        //     </div>

        //    </div>


        // </div>
        <div>
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
            <div className="details">
                <header className="details-header">
                    <h1>Patient Details</h1>
                </header>
                <div>
                    <button onClick={handleBack}>
                        Back
                    </button>
                </div>
                <main class="details-main">
                    {patientData &&
                        <section className="d-patientData-details">
                            <h2 class="d-h2">Patient Information</h2>
                            <p class="d-p"><strong>Id:</strong> {patientData._id}</p>
                            <p class="d-p"><strong>Name:</strong> {patientData.name}</p>
                            {/* <p class="d-p"><strong>Email:</strong> {patientData.email}</p> */}
                            <p class="d-p"><strong>Phone Number:</strong> {patientData.phoneNumber}</p>
                            <p class="d-p"><strong>Date of Birth:</strong> {patientData.birthDate}</p>
                            {/* <p class="d-p"><strong>Age:</strong> {patientData.age}</p> */}
                            <p class="d-p"><strong>Gender:</strong> {patientData.gender}</p>
                            <p class="d-p"><strong>Blood group:</strong> {patientData.bloodGroup}</p>
                        </section>
                    }
                    <section className="d-predicted-risks">
                        <h2 class="d-h2">Predicted Risks</h2>
                        <ul class="d-ul">
                            {/* {patientData.predictedRisks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                        ))} */}
                        </ul>
                    </section>
                    <section className="d-recommended-treatment">
                        <h2 class="d-h2">Recommended Treatment</h2>
                        <ul class="d-ul">
                            {/* {patientData.recommendedTreatment.map((treatment, index) => (
                            <li key={index}>{treatment}</li>
                        ))} */}
                        </ul>
                    </section>
                    <input
                        type="file"
                        class="form-control"
                        accept="application/pdf"
                    // onChange={(e) => setFile(e.target.files[0])}
                    // onChange={handleFileChange}
                    />
                </main>
            </div>
        </div>
    )
}