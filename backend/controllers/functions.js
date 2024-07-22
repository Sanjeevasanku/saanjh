const mongoose = require('mongoose');
require('dotenv').config();
const multer = require("multer");
const { MongoClient, GridFSBucket } = require("mongodb");
const { GridFsStorage } = require("multer-gridfs-storage");
const express = require('express');
const app = express();
app.use(express.json());

const { patient } = require("../schema.js");
const mongoURL = process.env.MONGO_URL


// const conn = mongoose.connection;
// let gfsBucket;

// conn.once("open", () => {
//   const client = new MongoClient(mongoURL);
//   client.connect().then(() => {
//     gfsBucket = new GridFSBucket(client.db("workshop"), { bucketName: "tests" });
//     console.log("Connected to database and GridFSBucket initialized");
//   }).catch(err => {
//     console.error("MongoClient connection error: ", err);
//   });
// });

// //const upload = multer({ storage: storage });
// const storage = new GridFsStorage({
//   url: mongoURL,
//   file: (req, file) => {
//     return {
//       filename: Date.now() + "-" + file.originalname,
//       bucketName: "tests"
//     };
//   }
// });

// const upload = multer({ storage });
const addPatient = async (req, res) => {

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
    res.json('hello');
}

// app.post("/en/addpatient", upload.single("file"), async (req, res) => {
//   const { fullName, email, phoneNumber, birthDate, gender, bloodGroup } = req.body;

//   let newPatient = new patient({
//     fullName,
//     email,
//     phoneNumber,
//     birthDate,
//     gender,
//     bloodGroup,
//     file: req.file.filename
//   });

//   try {
//     newPatient = await newPatient.save();
//     res.json({ status: 'ok', data: newPatient });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: err.message });
//   }
// });



module.exports={addPatient};