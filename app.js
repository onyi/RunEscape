const mongoose = require('mongoose');
const express = require("express");
const app = express();
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const scores = require("./routes/api/scores");
const lobbies = require("./routes/api/lobbies");
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

const http = require('http').Server(app);
const io = require('socket.io')(http, {});
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
app.use("/api/lobbies", lobbies);

app.use("/api/scores", scores);

const port = process.env.PORT || 5000;

let SOCKET_LIST = {};
// let PLAYER_LIST = {};

io.on('connection', socket => {
  console.log("User connected")

  socket.id = Math.random();
  while(SOCKET_LIST[socket.id]) {
    socket.id = Math.random();
  }
  SOCKET_LIST[socket.id] = socket;

  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    // delete PLAYER_LIST[socket.id];
  });

  socket.on('chat message', ({ lobbyId, msg }) => {
    console.log(`Got message: ${msg} on ${lobbyId}`)
    io.emit(`chat message to ${lobbyId}`, msg);
  })
});


const server = http.listen(port, () => console.log(`Server is running on port ${port}`));
