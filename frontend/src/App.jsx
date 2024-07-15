import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Doctor from "./components/Doctor"
import Caretaker from "./components/Caretaker"
import AddPatient from "./components/AddPatient";
import PatientDetails from "./components/PatientDetails";
import Signin from "./components/Signin";
import CaretakerAnalysis from "./components/CaretakerAnalysis";
import DoctorAnalysis from "./components/DoctorAnalysis";

function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/caretaker" element={<Caretaker />}/>
          <Route path="/addpatient" element={<AddPatient/>}/>
          <Route path="/getpatientdetails/:id" element={<PatientDetails/>}/>
          <Route path="/caretakeranalysis/:id" element={<CaretakerAnalysis/>}/>
          <Route path="/doctoranalysis/:id" element={<DoctorAnalysis/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
