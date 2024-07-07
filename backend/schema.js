const{ ObjectId } = require('mongodb');
const mongoose = require('mongoose');

patientSchema = new mongoose.Schema({
    // patientId:Number,
    fullName: String,
    email: String,
    phoneNumber: Number,
    birthDate: Date,
    gender: String,
    bloodGroup: String,
    // file : Object
})

const patient = mongoose.model('old', patientSchema);

module.exports = {patient}