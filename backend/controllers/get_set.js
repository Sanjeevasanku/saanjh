const { patient } = require("../schema.js");

const getPatients = async (req, res) => {
    try {
        const Patients = await patient.find();
        //  console.log("hi")
        res.send(Patients);
    } catch (err) {
        console.log("error fetching the patients", err);
        res.status(500).send(err);
    }
};

const getpatientdetails = async (req, res) => {
    const id = req.query.id; // Get the ID from the query parameters
    //console.log('Fetching details for ID:', id);

    try {
        const data = await patient.find({ _id: id });
        //console.log(data);
        res.send(data);
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).send('Server error');
    }
};

const uploadpatient = async (req, res) => {
    try {
        const patientData = new patient(req.body);
        await patientData.save();
        res.status(201).send(patientData);
    } catch (error) {
        res.status(400).send(error);
    }

}

const getfiles = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await patient.findOne({ _id: id }).select('fileId'); // Find a single document and select the fileId field
        if (!data) {
            return res.status(404).json({ message: 'No data found' });
        }
        const fileIds = data.fileId; // fileId is already an array
        // console.log(fileIds);
        res.json(fileIds); // Send the fileId array in the response
    } catch (error) {
        console.error("Error fetching file IDs:", error);
        res.status(500).send('Internal server error');
    }
};

module.exports={getPatients,getpatientdetails,uploadpatient,getfiles  }