import "./App.css";
import { useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Doctor from "./components/Doctor"
import Caretaker from "./components/Caretaker"
import AddPatient from "./components/AddPatient";
import PatientDetails from "./components/PatientDetails";
import Signin from "./components/Signin";
import CaretakerAnalysis from "./components/CaretakerAnalysis";
import DoctorAnalysis from "./components/DoctorAnalysis";
import Chatbot from "./components/Chatbot";

function App() {

  const [isDoctor, setIsDoctor] = useState(() => {
    const saved = localStorage.getItem('isDoctor');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('isDoctor', JSON.stringify(isDoctor));
  }, [isDoctor]);

  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin setIsDoctor={setIsDoctor} isDoctor={isDoctor}/>} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/caretaker" element={<Caretaker />}/>
          <Route path="/addpatient" element={<AddPatient/>}/>
          <Route path="/getpatientdetails/:id" element={<PatientDetails isDoctor={isDoctor}  setIsDoctor={setIsDoctor} />}/>
          <Route path="/caretakeranalysis/:id" element={<CaretakerAnalysis/>}/>
          <Route path="/doctoranalysis/:id" element={<DoctorAnalysis/>} />
          <Route path="/chatbot" element={<Chatbot/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
