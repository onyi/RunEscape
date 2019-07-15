const mongoose = require('mongoose');
const express = require("express");
const app = express();
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const scores = require("./routes/api/scores");
const bodyParser = require('body-parser');
const User = require('./models/User');
const passport = require('passport');

// app.get("/", (req, res) => res.send("Hello World"));

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport)

app.use("/api/users", users);

app.use("/api/scores", scores);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));