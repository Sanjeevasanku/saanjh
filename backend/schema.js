const{ ObjectId } = require('mongodb');
const mongoose = require('mongoose');

patientSchema = new mongoose.Schema({
    patientId:Number,
    name: String,
    // email: String,
    birthDate: Date,
    gender: String,
    chronics: Array,
    phoneNumber: Number,
    reportsList:Array,
    bloodGroup: String,
    // file : Object
})

saanjhSchema=new mongoose.Schema({
    name:String,
    doctors:Array,
    patients:Array,
    address:String,
    contact:Number

})

reportSchema=new mongoose.Schema({
    patient:String,
    patientId:ObjectId,
    doctor:String,
    file: ObjectId,
    dateOfReport:Date,
    valuesFromReport:Object,
    precations:Array,
    severity:Number,
    summary:String,
    specialistReq:String,
    possibleDiseases:Array,
    doctorNotes:String,
    periodicAnalysis:String,
    isVerified:Boolean,

})

doctorSchema = new mongoose.Schema({
    name:String,
    specialization:String
})

PdfSchema = new mongoose.Schema({
    name:String,
    data:Buffer
})

const patient = mongoose.model('spatients', patientSchema)
const report = mongoose.model('sreport', reportSchema)
const saanjh = mongoose.model('saanjh',saanjhSchema)
const doctor = mongoose.model('sdoctor',doctorSchema)
const pdf = mongoose.model('spdf', PdfSchema)

module.exports = {patient,report,saanjh,doctor,pdf}