const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const approutes = require("./AllRoutes")
const app = express();
const bodyParser = require('body-parser');

const {pdf} = require("./schema");

const PORT = process.env.PORT;
app.use(bodyParser.json({limit: '100mb'}));

app.use(express.json({limit:'100mb'}));

app.use(bodyParser.urlencoded({extended:true}));

const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL);
const connection = mongoose.connection;
connection.once('open',()=>{
  console.log("MongoDB connection established successfully");
})


app.use(express.static(path.join(__dirname, 'build')));

app.get("/",(req,res)=>{
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
})

app.use('/en', approutes);

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
});
