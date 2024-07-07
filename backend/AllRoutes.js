const express = require('express');
const router = require('express').Router();
const {addPatient} = require('../backend/controllers/functions.js')
const {getPatients,getpatientdetails,uploadpatient,getfiles} = require('../backend/controllers/get_set.js')
// const {addPatient} = require('../backend/controllers/pdfs.js')
// router.post('/addpatient', addPatient);
router.post('/uploadpatient', uploadpatient);
router.get('/getpatients', getPatients);
router.get('/getpatientdetails', getpatientdetails);

// const { addPatient } = require('./path-to-addPatient'); // Ensure the path is correct

// module.exports = (app) => {
//   app.post('/en/addpatient', addPatient);
// };

// const { addPatient } = require('./controllers/patientController.js'); // Ensure the path is correct

// module.exports = (app) => {
//   const upload = require('./controllers/upload.js'); // Ensure the path is correct

//   app.post('/en/addpatient', upload.single('file'), addPatient);
// }`;


module.exports=router;