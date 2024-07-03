// upload.js
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;

const storage = new GridFsStorage({
  url: mongoURL,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    console.log('File upload initiated:', file);
    return {
      filename: Date.now() + "-" + file.originalname,
      bucketName: "uploads"
    };
  }
});

storage.on('connection', (db) => {
    console.log('Connected to GridFS');
  });
  
  storage.on('file', (file) => {
    console.log('File stored successfully', file);
  });

const upload = multer({ storage });

module.exports = upload;
