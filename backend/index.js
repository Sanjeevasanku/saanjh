const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, GridFSBucket } = require("mongodb");

const approutes = require("./AllRoutes")
const app = express();

app.use(express.json());
app.use(cors());

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, 
  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}
)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// const conn = mongoose.connection;
// let gfsBucket;

// conn.once("open", () => {
//   const client = new MongoClient(mongoURL);
//   client.connect().then(() => {
//     gfsBucket = new GridFSBucket(client.db("workshop"), { bucketName: "uploads" });
//     console.log("Connected to database and GridFSBucket initialized");
//   }).catch(err => {
//     console.error("MongoClient connection error: ", err);
//   });
// });

// const upload = require('../backend/controllers/upload.js'); // Ensure the path is correct

// require('./AllRoutes')(app); // Correct path to your route handler

app.use('/en', approutes)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
});
