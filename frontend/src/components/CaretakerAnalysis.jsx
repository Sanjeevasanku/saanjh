import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from "../Assets/Logo.svg";
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jspdf library
import 'jspdf-autotable'; // Import autotable plugin
import Caretaker from './Caretaker';


export default function CaretakerAnalysis() {
  const [patient, setPatient] = useState(null);

  const { id } = useParams();

  const navigate=useNavigate()


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

  const handlePDFView = async () => {
    try {
      const response = await axios.get(`/en/files/${patient.file}`, { responseType: 'arraybuffer' });
      const binaryData = new Uint8Array(response.data);
      const blob = new Blob([binaryData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error fetching PDF file:", error);
    }
  };

  const generatePDF = () => {
    if (!patient) {
      console.error('Patient data is not loaded yet.');
      return;
    }

    const doc = new jsPDF();

    // Add report details to the PDF
    doc.setFontSize(18);
    doc.text('SAANJH SAHAYAK', doc.internal.pageSize.width / 2, 10, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Report Details', 10, 20);

    doc.setFontSize(12);
    doc.text(`ID: ${patient._id}`, 10, 35);
    doc.text(`Date of Report: ${patient.dateOfReport ? new Date(patient.dateOfReport).toLocaleDateString() : 'N/A'}`, 10, 45);
    doc.text(`Patient: ${patient.patient}`, 10, 55);

    // Split summary text into lines that fit within the page width
    const summaryLines = doc.splitTextToSize(patient.summary || '', doc.internal.pageSize.width - 20);
    doc.text('Summary:', 10, 65);
    summaryLines.forEach((line, index) => {
      if (index < 5) { // Limit to show only 5 lines of summary
        doc.text(line, 15, 75 + index * 10); // Adjust Y position based on index and line height
      }
    });

    doc.text(`Severity: ${patient.severity}`, 10, 135);
    doc.text(`Specialist Required: ${patient.specialistReq}`, 10, 145);
    let yPos = 155;

    // Add precautions
    if (patient.precations.length > 0) {
      doc.text('Precautions:', 10, yPos);
      yPos += 10;
      patient.precations.forEach((precation, index) => {
        yPos += 5; // Add spacing between each precaution
        doc.text(`- ${precation}`, 15, yPos + index * 10);
      });
      yPos += (patient.precations.length * 10) + 10; // Add extra space after precautions
    }

    // Add doctor's note
    if (patient.doctorNotes) {
      doc.text('Doctor\'s Note:', 10, yPos);
      yPos += 10;
      const doctorNoteLines = doc.splitTextToSize(patient.doctorNotes, doc.internal.pageSize.width - 20);
      doctorNoteLines.forEach((line, index) => {
        doc.text(line, 15, yPos + index * 10);
      });
    }

    // Save the PDF
    doc.save(`Report-${patient._id}.pdf`);
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
              <button className='save-button' onClick={generatePDF} >
                Download Analysis
              </button>
              <button className='save-button' onClick={handlePDFView} >
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
