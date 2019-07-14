const db = require('./config/keys').mongoURI;

const mongoose = require('mongoose');
const express = require('express');

mongoose
  .connect(db, { useNewUrlParser: true  })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch( err => console.log(err));


const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome! You are in a welcome page :)");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


