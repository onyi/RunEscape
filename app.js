const express = require('express');

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


