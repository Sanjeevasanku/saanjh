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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {patient ? (
          <div style={{ 
            padding: '10px',
            marginTop: '6%',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '70%',
            minHeight: '70vh',
          }}>
            <h2 style={{ textAlign: 'center' }}>REPORT DETAILS</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p><strong>ID:</strong> {patient._id}</p>
              <p><strong>Date of Report:</strong> {patient.dateOfReport ? new Date(patient.dateOfReport).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p><strong>Patient:</strong> {patient.patient}</p>
              <p><strong>Severity:</strong> {patient.severity}</p>
            </div>
            <p><strong>Summary:</strong> {patient.summary}</p>
            <p><strong>Specialist Required:</strong> {patient.specialistReq}</p>
            <p><strong>Precautions</strong></p> {patient.precations.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      <li>{condition}</li>
                    </span>
                  ))}
            <p><strong>Possible Diseases</strong></p> {patient.possibleDiseases.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      <li>{condition}</li>
                    </span>
                  ))}
            <p><strong>Doctor's Note:</strong> {patient.doctorNotes}</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              
              <button style={{ padding: '10px 20px', backgroundColor: '#990011FF', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}  >
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
