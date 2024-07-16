import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DoctorAnalysis() {
    const [patient, setPatient] = useState(null);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const getReportDetails = async () => {
            try {
                const response = await axios.get(`/en/getreportdetails?id=${id}`);
                setPatient(response.data);
                setDoctorNotes(response.data.doctorNotes || ''); // Assuming doctorNotes is part of the response
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        getReportDetails();
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // Update doctorNotes in the backend
            await axios.post(`/en/updateDoctorNotes/${id}`, { doctorNotes });
            setIsEditing(false);
            alert("Doctor notes updated successfully.")
            console.log('Doctor notes updated successfully.');
        } catch (error) {
            console.error('Error updating doctor notes:', error);
        }
    };

    const handleCancel = () => {
        // Reset doctorNotes to its original value
        setDoctorNotes(patient.doctorNotes || '');
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setDoctorNotes(e.target.value);
    };

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


                        <div className="report-notes">
                            {isEditing ? (
                                <textarea
                                    value={doctorNotes}
                                    onChange={handleChange}

                                />
                            ) : (
                                <p><strong>Doctor's Notes:</strong> {doctorNotes}</p>
                            )}
                        </div>
                        <div className="button-container">
                            {isEditing ? (
                                <div>
                                    <button
                                        onClick={handleSave}
                                        className="save-button"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <button
                                            onClick={handleEdit}
                                            className="save-button"
                                        >
                                            Edit Doctor's Notes
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleEdit}
                                            className="save-button"
                                        >
                                            View Report
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading report details...</p>
                )}
            </div>
        </div>
    );
}