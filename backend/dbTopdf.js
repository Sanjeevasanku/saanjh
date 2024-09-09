const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Define the Report schema and model
const reportSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    precations: Array,
    doctorNotes: String,
    summary: String,
    severity: Number,
    specialistReq: String,
    dateOfReport: Date,
    possibleDiseases:Array,
    // Additional fields can be added here
});

const Report = mongoose.model('report', reportSchema);

// Define the Patient schema and model
const patientSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    birthDate: Date,
    gender: String,
    chronics: Array, // Chronic diseases like diabetes, BP
    reportsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'report' }],
});

const Patient = mongoose.model('patient', patientSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://sanjeeva:Bablu@cluster0.n00otbs.mongodb.net/saanjh?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Increased connection timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to generate PDF
async function generatePDF(patients) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('details.pdf'));

    // Add title
    doc.fontSize(25).text('Patient Report', { align: 'center' });
    doc.moveDown();

    // Add data to the PDF
    for (const patient of patients) {
        doc.fontSize(14).text(`Patient ID: ${patient._id}, { underline: true }`);
        doc.fontSize(12).text(`Name: ${patient.name}`);
        doc.text(`DOB: ${new Date(patient.birthDate).toDateString()}`); // Format DOB
        doc.text(`Gender: ${patient.gender}`);
        doc.text(`Chronic Diseases: ${patient.chronics.join(', ') || 'None'}`);
        doc.moveDown();

        if (patient.reportsList && patient.reportsList.length > 0) {
            for (const reportId of patient.reportsList) {
                try {
                    const report = await Report.findById(reportId);
                    if (report) {
                        doc.fontSize(14).text(`Report ID: ${report._id}, { underline: true }`);
                        doc.fontSize(12).text(`Date of Report: ${new Date(report.dateOfReport).toDateString()}`);
                        doc.text(`Severity: ${report.severity}`);
                        doc.text(`Specialist Required: ${report.specialistReq}`);
                        doc.text(`Summary: ${report.summary}`);
                        doc.text(`Doctor's Notes: ${report.doctorNotes}`);
                        doc.text(`Precautions: ${report.precations.join(', ') || 'None'}`);
                        doc.text(`possibleDiseases: ${report.possibleDiseases.join(', ') || 'None'}`);
                        doc.moveDown();
                    }
                } catch (err) {
                    console.error(`Error fetching report with ID ${reportId}:`, err);
                }
            }
        } else {
            doc.text('No reports available for this patient.');
            doc.moveDown();
        }
    }

    // Finalize the PDF and end the stream
    doc.end();
}

// Fetch data from MongoDB and generate the PDF
async function createPatientReport() {
    try {
        console.log('Fetching patients from MongoDB...');
        const patients = await Patient.find().populate('reportsList'); // Fetch all patient data with populated reports
        if (patients.length === 0) {
            console.log('No patients found.');
            return;
        }
        console.log('Generating PDF...');
        await generatePDF(patients);
        console.log('PDF generated successfully.');
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        mongoose.connection.close(); // Close MongoDB connection after processing
        console.log('MongoDB connection closed.');
    }
}

// Run the function to create the report
createPatientReport();