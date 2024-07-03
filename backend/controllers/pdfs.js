const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const pdf = require('pdf-parse');
require('dotenv').config(); // Ensure dotenv is loaded at the top
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongoURI = process.env.MONGO_URL; // Ensure the environment variable name matches exactly
const databaseName = 'workshop';

if (!mongoURI) {
    console.error('MONGO_URL not defined in environment variables');
    process.exit(1);
}

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
        db = client.db(databaseName);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectToDatabase();

// Middleware setup
app.use(express.json({ limit: '100mb' })); // Increase body-parser limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// POST endpoint for file upload
const uploadpdf = async (req, res) => {
    try {
        if (!db) {
            throw new Error('MongoDB connection not established.');
        }

        const { file, filename } = req.body;

        const uploadFile = async (data, name) => {
            const buffer = Buffer.from(data, 'base64');
            const bucket = new GridFSBucket(db);
            const uploadStream = bucket.openUploadStream(name);
            const fileId = uploadStream.id;

            await new Promise((resolve, reject) => {
                uploadStream.end(buffer, (error) => {
                    if (error) {
                        console.error(`Error uploading ${name}:`, error);
                        reject(error);
                    } else {
                        console.log(`${name} uploaded successfully, stored under id:`, fileId);
                        resolve(fileId);
                    }
                });
            });

            return fileId;
        };

        const fileId = file ? await uploadFile(file, filename) : null;
        console.log("File saved successfully");
        res.json({ status: 'ok', fileId: fileId });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to save pdf details' });
    }
};

// GET endpoint to fetch a PDF by ID
const pdfid = async (req, res) => {
    try {
        const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        let gfs;
        conn.once('open', () => {
            gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'fs'
            });
        });

        const fileId = new mongoose.Types.ObjectId(req.params.id);

        if (!gfs) {
            conn.once('open', () => {
                gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                    bucketName: 'fs'
                });
                const readStream = gfs.openDownloadStream(fileId);
                res.set('Content-Type', 'application/pdf');
                readStream.pipe(res);
            });
        } else {
            gfs.openDownloadStream(fileId).pipe(res);
        }
    } catch (err) {
        console.error('Error fetching PDF:', err);
        res.status(500).json({ error: 'Failed to fetch PDF' });
    }
};

const pdfparse = async (req, res) => {
    try {
        console.log("hi");
        console.log(req);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { uploadpdf, pdfid, pdfparse };





// const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');

// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
// const mongoURI = "mongodb+srv://Project:Florencemidhebaramvesam@project.tbx2krn.mongodb.net/Saanjh";
// const databaseName = 'Saanjh';
// const client = new MongoClient(mongoURI);
// let db;
// client.connect();
// db = client.db(databaseName);

// const uploadpdf = async (req, res) => {
//     try {
//         if (!db) {
//             throw new Error('MongoDB connection not established.');
//         }
//         const { file, filename } = req.body;
//         let fileId;
//         const uploadFile = async (data, name) => {
//             const buffer = Buffer.from(data, 'base64');
//             const bucket = new GridFSBucket(db);
//             const uploadStream = bucket.openUploadStream(name);
//             const fileId = uploadStream.id;

//             await new Promise((resolve, reject) => {
//                 uploadStream.end(buffer, (error) => {
//                     if (error) {
//                         console.error(`Error uploading ${name}:`, error);
//                         reject(error);
//                     } else {
//                         console.log(`${name} uploaded successfully, stored under id:`, fileId);
//                         resolve(fileId);
//                     }
//                 });
//             });

//             return fileId;
//         };
//         fileId = file ? await uploadFile(file, filename) : null;
//         console.log("Project details saved successfully");
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to save pdf details' });
//     }
// }

// const pdfid = async (req, res) => {
//     try {
        
//         const conn = mongoose.createConnection("mongodb+srv://Project:Florencemidhebaramvesam@project.tbx2krn.mongodb.net/Saanjh");
//         let gfs;
//         conn.once('open', () => {
//             gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//                 bucketName: 'fs'
//             });
//         });

//         const id = req.params.id;
//         console.log(id);
//         if (!id || id.length !== 24) {
//             throw new Error('Invalid ObjectId format');
//         }
        
//         const fileId = new mongoose.Types.ObjectId(id);
//         console.log(fileId);

//       //  res.set('Content-Type', 'application/pdf');

//         if (!gfs) {
//             conn.once('open', () => {
//                 gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//                     bucketName: 'fs'
//                 });
//                 gfs.openDownloadStream(fileId).pipe(res);
//             });
//         } else {
//             gfs.openDownloadStream(fileId).pipe(res);
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// };

// module.exports = {uploadpdf,pdfid}