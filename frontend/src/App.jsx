import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Doctor from "./components/Doctor"
import Caretaker from "./components/Caretaker"
import AddPatient from "./components/AddPatient";
import PatientDetails from "./components/PatientDetails";

function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/caretaker" element={<Caretaker />}/>
          <Route path="addpatient" element={<AddPatient/>}/>
          <Route path="patientdetails" element={<PatientDetails/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
