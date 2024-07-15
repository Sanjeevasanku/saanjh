import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jspdf library
import 'jspdf-autotable'; // Import autotable plugin
import Caretaker from './Caretaker';


export default function CaretakerAnalysis() {
  const [patient, setPatient] = useState(null);

  const { id } = useParams();


  useEffect(() => {
    const getReportDetails = async () => {
      try {
        const response = await axios.get(`/en/getreportdetails?id=${id}`);
        console.log(response.data);
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching report details:', error);
      }
    };

    getReportDetails();
  }, [id]);




  return (
    <div>
      <div className="doctor-analysis-container">
        {patient ? (
          <div className="report-details">
            <h3 className="report-header"><strong>REPORT DETAILS</strong></h3>
            <div className="report-info">
              <p><strong>ID:</strong> {patient._id}</p>
              <p><strong>Date of Report:</strong> {patient.dateOfReport ? new Date(patient.dateOfReport).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="report-info">
              <p><strong>Patient:</strong> {patient.patient}</p>
              <p><strong>Severity:</strong> {patient.severity}</p>
            </div>


            <div className="report-summary">
              <p><strong>Summary:</strong> {patient.summary}</p>
            </div>
            <div className="report-specialist">
              <p><strong>Specialist Required:</strong> {patient.specialistReq}</p>
            </div>
            <div className="report-precautions">
              <p><strong>Precautions</strong></p>
              <ul>
                {patient.precations.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
            <div className="report-diseases">
              <p><strong>Possible Diseases</strong></p>
              <ul>
                {patient.possibleDiseases.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>

            <div>
              <p><strong>Doctor's Note:</strong> {patient.doctorNotes}</p>
            </div>

            <div className='button-container'>
              <button className='edit-button'  >
                View Report
              </button>
            </div>
          </div>
        ) : (
          <p>Loading report details...</p>
        )}
      </div>
    </div>
  );
}
