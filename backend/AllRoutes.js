const router = require('express').Router();

// const {getPatient,setPatient,editPatient,getPatients} = require('./controllers/get_set');
const {getReport, getPatient,setPatient,editPatient,getDates,getPrevReports,getPatients,getReports,getSaanjhInfo,savePrecautions,getreportsdetails,updatedoctornotes,login,newuser,passwordreset} = require('./controllers/get_set');
const {  getParameters, analysis, chatbot }=require('./controllers/LLM');
const {uploadpdf,pdfid,pdfparse,reciver} =require('./controllers/pdfs');

router.get('/getreport/:id', getReport);
router.get('/getpatient', getPatient);
router.get('/getpatients', getPatients);
router.get('/getsaanjhinfo', getSaanjhInfo);
router.get('/files/:id',pdfid);
// router.get('/pdfid/:id',pdfid);
router.get('/getdates/',getDates);
router.get('/getreports',getReports);
router.get('/getreportdetails',getreportsdetails);


router.post("/updateDoctorNotes/:id",updatedoctornotes)
router.post('/setpatient',setPatient);
// router.post('/upload', uploadReport);
router.post('/uploadpdf', uploadpdf);
router.post('/pdfparse', pdfparse);
router.post('/reciver',reciver);
router.post('/getparameters',getParameters);
router.post('/analysis',analysis);
router.post('/saveprecautions',savePrecautions);
router.post('/getprevreports',getPrevReports);
router.post('/editPatient',editPatient);
router.post('/chatbot',chatbot)
router.post('/login',login);
router.post('/newuser',newuser);
router.post('/reset-password/:token',passwordreset);



// const {addPatient} = require('../backend/controllers/functions.js')
// const {getPatients,getpatientdetails,uploadpatient,getfiles} = require('../backend/controllers/get_set.js')
// const {addPatient} = require('../backend/controllers/pdfs.js')
// router.post('/addpatient', addPatient);
// router.post('/uploadpatient', uploadpatient);
// router.get('/getpatients', getPatients);
// router.get('/getpatientdetails', getpatientdetails);



module.exports=router;