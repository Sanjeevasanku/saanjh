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

//login
adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  });
  
  
adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" });
    return token;
  };
const Admin = mongoose.model('admin', adminSchema)

const patient = mongoose.model('patients', patientSchema)
const report = mongoose.model('report', reportSchema)
const saanjh = mongoose.model('saanjh',saanjhSchema)
const doctor = mongoose.model('doctor',doctorSchema)
const pdf = mongoose.model('pdf', PdfSchema)


module.exports = {patient,report,saanjh,doctor,pdf,Admin}