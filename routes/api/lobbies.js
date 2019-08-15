const express = require("express");
const router = express.Router();
const Lobby = require('../../models/Lobby');
const validateCreateLobbyInput = require('../../validation/createLobby');

router.get("/test", (req, res) => res.json({ msg: "This is the lobbies route" }));

router.get('/', (req, res) => {
  Lobby.find({gameMode: 0})
    .sort({ date: -1 })
    .then(lobbies => res.json(lobbies))
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobbies found" }))
});

router.get('/:lobbyId', (req, res) => {
  Lobby.findOne(
    { "_id": req.params.lobbyId })
    .exec()
    .then(data => {
      res.json(data)
    })
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobby found" }))
})

router.post('/create', (req, res) => {
  const { errors, isValid } = validateCreateLobbyInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  
  console.log(`Request body: ${JSON.stringify(req.body)}`)
  
  const newLobby = new Lobby({
    name: req.body.name,
    hostPlayerId: req.body.hostPlayerId,
    players: [req.body.hostPlayerId],
    gameMode: 0,
  })

  if (req.body.gameMode) {
    newLobby.gameMode = req.body.gameMode;
  }
  
  newLobby
    .save()
    .then(lobby => res.json(lobby))
    .catch(err => console.log(err));
});

router.patch('/:lobbyId/join', (req, res) => {
  let currentUserId = req.body.currentUserId;

  Lobby.findOneAndUpdate(
    { "_id": req.params.lobbyId }, 
    { $addToSet: { players: currentUserId }}, 
    { "new": true })
      .exec()
      .then(data => {
        res.json(data)
        })
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobby found"}));
});


router.patch('/state/:lobbyId', (req, res) => {
  let gameState = req.body.gameState;
  let lobbyId = req.param.lobbyId;
  console.log(`Update Game State: ${gameState}`);
  Lobby.findOneAndUpdate(
    { "_id": lobbyId },
    { $set: { gameState: gameState} },
    { "new": true})
      .exec()
      .then(data => {
        res.json(data)
      })
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobby found" }));
});

module.exports = router;