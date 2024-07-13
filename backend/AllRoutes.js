const router = require('express').Router();

const {getReport, getPatient,setPatient,editPatient,getDates,getPrevReports,getPatients,getReports,getSaanjhInfo,savePrecautions} = require('./controllers/get_set');
const { uploadReport, getParameters, analysis }=require('./controllers/LLM');
const {uploadpdf,pdfid,pdfparse,receiver} =require('./controllers/pdfs');

router.get('/getreport/:id', getReport);
router.get('/getpatient/:id', getPatient);
router.get('/getpatients', getPatients);
router.get('/getsaanjhinfo', getSaanjhInfo);
router.get('/pdfid/:id',pdfid);
router.get('/getdates/:id',getDates);
router.get('/getreports',getReports);

router.post('/setPatient',setPatient);
router.post('/upload', uploadReport);
router.post('/uploadpdf', uploadpdf);
router.post('/pdfparse', pdfparse);
router.post('/reciver',receiver);
router.post('/getparameters',getParameters);
router.post('/analysis',analysis);
router.post('/saveprecautions',savePrecautions);
router.post('/getprevreports',getPrevReports);
router.post('/editPatient',editPatient);



// const {addPatient} = require('../backend/controllers/functions.js')
// const {getPatients,getpatientdetails,uploadpatient,getfiles} = require('../backend/controllers/get_set.js')
// const {addPatient} = require('../backend/controllers/pdfs.js')
// router.post('/addpatient', addPatient);
// router.post('/uploadpatient', uploadpatient);
// router.get('/getpatients', getPatients);
// router.get('/getpatientdetails', getpatientdetails);



module.exports=router;