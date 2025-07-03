const express = require('express');
const app = express();
// const { patient,report } = require('../schema');
const { ObjectId } = require('mongodb');

const { patient,report,User} = require("../schema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const getReport = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const reportInfo = await report.findOne({ _id: id });
        res.json(reportInfo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Failed to retrieve reports' });
    }
};

const getPatient = async (req, res) => {
    const id = req.query.id;
    try {
        // console.log('inside backend')

        const patientInfo = await patient.findOne({ _id: id });
        if (!patientInfo) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // console.log(patientInfo);
        // console.log(patientInfo.reportsList);
        res.json(patientInfo);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const setPatient = async (req, res) => {
    const info = req.body;

    console.log('Received form data: ', info);
    try {
        let newPatient = new patient({
            name: info.firstName + ' ' + info.lastName,
            birthDate: info.dateOfBirth,
            chronics: info.chronics,
            bloodGroup: info.bloodGroup,
            phoneNumber: info.phoneNumber,
            gender: info.gender
        });
        newPatient = await newPatient.save();
        console.log('Patient saved');
        res.json({ data: 'success' });
    }
    catch (err) {
        console.error('Error saving the patient', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const editPatient = async (req, res) => {
    const { formDataToSend, patientId } = req.body;
    console.log(patientId, formDataToSend);

    const patientInfo = await patient.findOne({ _id: patientId });
    patientInfo.name = formDataToSend.firstName + ' ' + formDataToSend.lastName;
    patientInfo.birthDate = formDataToSend.dateOfBirth;
    patientInfo.chronics = formDataToSend.chronics;
    patientInfo.bloodGroup = formDataToSend.bloodGroup;
    patientInfo.phoneNumber = formDataToSend.phoneNumber;
    patientInfo.gender = formDataToSend.gender;
    patientInfo.save();
    console.log('Success');
    res.json({ data: 'Succes' });
};

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getDates = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await report.find({ patientId: id });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No reports found for this patient' });
        }

        const dates = data.map(item => ({
            file: item._id,
            specialistReq: item.specialistReq,
            date: item.valuesFromReport.date ? item.valuesFromReport.date : formatDate(item.dateOfReport)
        }));

        res.json(dates);
    }
    catch (error) {
        console.error('error retrieving reports:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPrevReports = async (req, res) => {
    try {
        const { patientId, reportId } = req.body;

        if (!patientId || !reportId) {
            return res.status(400).json({ message: 'Patient ID and Report ID are required' });
        }

        console.log(reportId);
        const data = await report.find({ patientId: patientId });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No reports found for this patient' });
        }

        const modified = data.filter(item => item._id.toString() !== reportId.toString());

        const dates = data.map(item => ({
            file: item._id,
            specialistReq: item.specialistReq,
            date: item.valuesFromReport.date ? item.valuesFromReport.date : formatDate(item.dateOfReport)
        }));

        res.json(dates);
    }
    catch (error) {
        console.error('error retrieving reports:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        // console.log('inside backend');
        const Patients = await patient.find();
        //  console.log(Patients);
        res.json(Patients);
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: 'Failed to retrieve patients' });
    }
};

const getReports = async (req, res) => {
    try {
        const reports = await report.find();

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'No reports found' });
        }

        res.json(reports);
    } catch (error) {
        console.error('Error retrieving reports:', error.message);
        res.status(500).json({ error: 'Failed to retrieve reports', details: error.message });
    }
};

const getSaanjhInfo = async (req, res) => {
    try {
        const name = req.params.name;
        const saanjhDetails = await saanjh.findOne({ name: name });

        if (!saanjhDetails) {
            return res.status(404).json({ message: 'Saanjh details not found' });
        }
        res.json(saanjhDetails);
    }
    catch (error) {
        console.error('Error retrieving saanjh details:', error.message);
        res.status(500).json({ error: 'Failed to retrieve saanjh details', details: error.message });
    }
};

const savePrecautions = async (req, res) => {
    try {
        const { reportId, precautions, doctorNotes } = req.body;
        const reportToUpdate = await report.findOne({ _id: reportId });

        if (!reportToUpdate) {
            return res.status(404).json({ message: 'Report not found' });
        }

        reportToUpdate.precautions = precautions;
        reportToUpdate.doctorNotes = doctorNotes;
        reportToUpdate.isVerified = true;

        const updatedReport = await reportToUpdate.save();
        res.json(updatedReport);
    }
    catch (error) {
        console.error('Error saving precations:', error.message);
        res.status(500).json({ error: 'Failed to save precations', details: error.message });
    }
}

const getreportsdetails = async (req, res) => {
    const { id } = req.query;



    try {
        const details = await report.findOne({ _id: id });
        if (!details) {
            return res.status(404).json({ message: 'No report found for the given ID.' });
        }
        console.log(details)

        res.json(details);
    } catch (error) {
        console.error('Error fetching report details:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}



const updatedoctornotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorNotes } = req.body;


        // Validate inputs if needed
        if (!doctorNotes) {
            return res.status(400).json({ error: 'Doctor notes are required' });
        }

        const updatedReport = await report.findByIdAndUpdate(id, { doctorNotes: doctorNotes, isVerified: "true" }, { new: true });
        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error updating doctor notes:', error);
        res.status(500).json({ error: 'Error updating doctor notes' });
    }
}


// const getpatientdetails = async (req, res) => {
//     const id = req.query.id; // Get the ID from the query parameters
//     //console.log('Fetching details for ID:', id);

//     try {
//         const data = await patient.find({ _id: id });
//         //console.log(data);
//         res.send(data);
//     } catch (error) {
//         console.error('Error fetching patient details:', error);
//         res.status(500).send('Server error');
//     }
// };

// const uploadpatient = async (req, res) => {
//     try {
//         const patientData = new patient(req.body);
//         await patientData.save();
//         res.status(201).send(patientData);
//     } catch (error) {
//         res.status(400).send(error);
//     }

// }

// const getfiles = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const data = await patient.findOne({ _id: id }).select('fileId'); // Find a single document and select the fileId field
//         if (!data) {
//             return res.status(404).json({ message: 'No data found' });
//         }
//         const fileIds = data.fileId; // fileId is already an array
//         // console.log(fileIds);
//         res.json(fileIds); // Send the fileId array in the response
//     } catch (error) {
//         console.error("Error fetching file IDs:", error);
//         res.status(500).send('Internal server error');
//     }
// };

const login=async(req,res)=>
    {
      const { email, password, role } = req.body;
     
    
      try {
       
        const user = await User.findOne({ email:email, role:role });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials.' });
        }
    
     
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials.' });
        }
    
        res.status(200).json({ msg: 'Login successful!' });
      } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
      }
    }
    
    
    
    
    const newuser=async(req,res)=>
    {
      const { email, name,role  } = req.body;
    
    
      
    
      try {
        
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: 'User already exists.' });
        }
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        user = new User({ email, name, role, resetToken });
        await user.save();
    
        
    
       
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mathiangelina0@gmail.com',
            pass: 'jjchdkaawgqwqkoo'
          }
        });
        const mailOptions = {
          from: 'mathiangelina0@gmail.com',
          to: email,
          subject: 'Password Reset',
          html: `<p>Click <a href="${resetUrl}">here</a> to set your password.</p>`
        };
    
        await transporter.sendMail(mailOptions);
       
        res.status(200).json({ msg: 'Signup successful! Please check your email to set your password.' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Server error.' });
      }
    }
    
    
    const passwordreset=async(req,res)=>
    {
      const { token } = req.params;
      const { password } = req.body;
    
      try {
       
        const user = await User.findOne({ resetToken: token });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid or expired token.' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
       
        user.password = hashedPassword; 
        user.resetToken = token; 
        await user.save();
    
        res.status(200).json({ msg: 'Password has been set successfully! You can now login.' });
      } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
      }
    }



module.exports = { getReport, getPatient, setPatient, editPatient, getDates, getPrevReports, getPatients, getReports, getSaanjhInfo, savePrecautions,getreportsdetails, updatedoctornotes,login,newuser,passwordreset};
// module.exports={getPatient,setPatient,editPatient,getPatients};