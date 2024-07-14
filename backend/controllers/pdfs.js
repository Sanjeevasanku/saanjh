const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const Pdf = require('pdf-parse');
const multer = require('multer');
const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { analysis } = require('./LLM');
require('dotenv').config();
const mongoURL = process.env.MONGO_URL;
const databaseName = 'saanjh';
const client = new MongoClient(mongoURL);
let db;
client.connect();
db = client.db(databaseName);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadpdf = async (req, res) => {
    try {
        if (!db) {
            throw new Error('MongoDB connection not established');
        }

        const { file, filename, patientId, name } = req.body;

        const uploadFile = async (data, name) => {
            const buffer = Buffer.from(data, 'base64');
            const bucket = new GridFSBucket(db);
            const uploadStream = bucket.openUploadStream(name);
            const fileId = uploadStream.id;
            let parsed;


            await Pdf(buffer).then(function (data) {
                parsed = (data.text);
            })

            const response = await axios.post('http://localhost:5173/en/getparameters', { text: parsed });
            if (response.data.data === false) {
                return { fileId: null, jsonObject: null };
            }

            const jsonObject = response.data.data;

            await new Promise((resolve, reject) => {
                uploadStream.end(buffer, (error) => {
                    if (error) {
                        console.error(`Error uploading ${name}:`, error);
                        reject(error);
                    }
                    else {
                        console.log(`${name} uploaded successfully, stored under id:`, fileId);
                        resolve(fileId);
                    }
                });
            });
            return { fileId, jsonObject };
        };
        const fileDetails = file ? await (file, filename) : null;
        if (fileDetails.fileId === null) {
            return res.json({ data: false });
        }
        const fileId = fileDetails.fileId;
        const jsonObject = fileDetails.jsonObject;

        const analysis_response = await axios.post('http://localhost:5173/en/analysis', { fileId: fileId, jsonObject: jsonObject, patientId: patientId, name: name });
        console.log('analysis response ', analysis_response.data.data);
        return res.json({ data: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save pdf details' });
    }
};

const pdfid = async (req, res) => {
    try {
        const conn = mongoose.createConnection(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let gfs;
        conn.once('open', () => {
            gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'ss'
            });
        });

        const fileId = new mongoose.Types.ObjectId(req.params.id);

        if (!gfs) {
            conn.once('open', () => {
                gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                    bucketName: 'ss'
                });
                const readStream=gfs.openDownloadStream(fileId);
                res.set('Content-Type','application/pdf');
                readStream.pipe(res);
            });
        }
        else{
            gfs.openDownloadStream(fileId).pipe(res);
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

// const pdfid = async (req, res) => {
//     try {
//         // Ensure MongoDB connection is established
//         const conn = await mongoose.createConnection("mongodb+srv://Project:Florencemidhebaramvesam@project.tbx2krn.mongodb.net/Saanjh", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         conn.once('open', () => {
//             const gfs = new GridFSBucket(conn.db, { bucketName: 'fs' });
//             const fileId = new mongoose.Types.ObjectId(req.params.id);

//             // Stream the file from GridFS
//             const readStream = gfs.openDownloadStream(fileId);
//             readStream.on('error', (error) => {
//                 console.error('Error streaming file:', error.message);
//                 return res.status(404).send('File not found');
//             });

//             res.set('Content-Type', 'application/pdf');
//             readStream.pipe(res);
//         });

//         conn.on('error', (error) => {
//             console.error('Connection error:', error.message);
//             return res.status(500).send('Failed to connect to the database');
//         });

//     } catch (error) {
//         console.error('Unexpected error:', error.message);
//         return res.status(500).send('Internal server error');
//     }
// };

const pdfparse = async (req, res) => {
    try {
        const { file } = req.body;
        if (!file) {
            return res.status(400).send('No file provided');
        }
        
        const buffer = Buffer.from(file, 'base64');
        
        const data = await Pdf(buffer);
        const extractedText = data.text;

        res.json({ text: extractedText });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
};

const receiver = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).send('No text provided');
        }
        
        // Process the parsed text as needed
        console.log('Received text:', text);

        res.json({ message: 'Text received successfully', text });
    } catch (error) {
        console.error('Error processing text:', error);
        res.status(500).send('Error processing text');
    }
};

module.exports = {uploadpdf,pdfid,pdfparse,receiver,analysis};

