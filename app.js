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

const Lobby = require('./models/Lobby');
const User = require('./models/User');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

const http = require('http').Server(app);
const io = require('socket.io')(http, {});

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
let PLAYER_LIST = {};

io.on('connection', socket => {
  console.log("User connected")

  socket.id = Math.random();
  while(SOCKET_LIST[socket.id]) {
    socket.id = Math.random();
  }

  SOCKET_LIST[socket.id] = socket;

  // remove associated player from lobbies per socket
  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    
    if (PLAYER_LIST[socket.id] !== undefined) {
      PLAYER_LIST[socket.id].forEach(({ playerId, lobbyId}) => {
        console.log(`try disconnect ${playerId} from ${lobbyId}`)
        Lobby.findOneAndUpdate(
          { "_id": lobbyId },
          { $pullAll: { players: [playerId] } })
          .catch(err => console.log(`Could not d/c user: ${err}`));
        io.emit(`relay action to ${lobbyId}`, { playerId: playerId, playerAction: "leaveLobby" });
      })
      
      // let user = User.findById(playerId);
      // console.log(user.username);
      // io.emit(`chat message to ${lobbyId}`, `${user.username} disconnected` );
    }

    delete PLAYER_LIST[socket.id];
  });

  socket.on('chat message', ({ lobbyId, msg }) => {
    // console.log(`Got message: ${msg} on ${lobbyId}`)
    io.emit(`chat message to ${lobbyId}`, msg);
  })

  // relay player actions to lobby it originated in
  socket.on('relay action', ({ lobbyId, playerId, playerAction }) => {
    console.log(`Relay: ${playerId} on ${lobbyId} did ${playerAction}`)
    io.emit(`relay action to ${lobbyId}`, { playerId, playerAction });

    // store lobbies joined per socTket
    if (playerAction === "joinLobby") {
      if (PLAYER_LIST[socket.id] === undefined) {
        PLAYER_LIST[socket.id] = [{ "playerId": playerId, "lobbyId": lobbyId }];
      } else {
        PLAYER_LIST[socket.id].push({ "playerId": playerId, "lobbyId": lobbyId });
      }
      console.log("Bound user socket to ID");
    }
  })

  socket.on('relay game state', ({ lobbyId, playerId, gameState, randomNum }) => {
    // console.log(`Relay game state on ${lobbyId}. State: ${gameState}`)
    io.emit(`relay game state to ${lobbyId}`, { playerId, gameState, randomNum });
  })

  socket.on('relay heartbeat', ({ lobbyId, playerId, game }) => {
    // console.log(`Relay game state on ${lobbyId}. State: ${gameState}`)
    io.emit(`relay heartbeat to ${lobbyId}`, { playerId, game });
  })
});

setInterval( () => {
  // Logic to clear empty lobby here
  Lobby.find().then( lobbies => {
    let removeLobbies = lobbies.map( lobby => {
      // console.log(`Lobby: ${lobby.name}, ID: ${lobby._id}; players: ${lobby.players}`)
      if (lobby.players.length < 1) {
        // console.log(`Lobby ${lobby._id} has no player, removing soon`)
        return lobby._id;
      }
    })
    // console.log(`Lobby to be deleted: ${removeLobbies}`);
    // Delete lobby by ID array
    if(removeLobbies.length !== 0){
      Lobby.deleteMany( {id: { $in : removeLobbies }}, function(err) { console.log(`Error when deleting lobby: ${err}`)});
    }
 


  })
}, 43200000) // Delete lobby for every 12 hours


const server = http.listen(port, () => console.log(`Server is running on port ${port}`));
