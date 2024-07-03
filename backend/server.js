const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// const { MongoClient, GridFSBucket } = require("mongodb");
const app = express();

app.use(express.json());
app.use(cors());

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, 
  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}
)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const patientSchema = new mongoose.Schema({
    // patientId:Number,
    fullName: String,
    email: String,
    phoneNumber: Number,
    birthDate: Date,
    gender: String,
    bloodGroup: String,
    file : Object
})

const patient = mongoose.model('patient', patientSchema);

app.post('/addpatients' , async (req, res) => {

    let newpatient = new patient({
        fullName : req.body.fullName,
        email : req.body.email,
        phoneNumber : req.body.phoneNumber,
        birthDate : req.body.birthDate,
        gender : req.body.gender,
        bloodGroup : req.body.bloodGroup,
        // file : req.body.file[0]
    })
    newpatient = await newpatient.save();
    res.json(newpatient);
}
)
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
});
