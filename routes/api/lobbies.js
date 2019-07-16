const express = require("express");
const router = express.Router();
const Lobby = require('../../models/Lobby');
const validateCreateLobbyInput = require('../../validation/createLobby');

router.get("/test", (req, res) => res.json({ msg: "This is the lobbies route" }));

router.get('/', (req, res) => {
  Lobby.find()
    .sort({ date: -1 })
    .then(lobbies => res.json(lobbies))
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobbies found" }))
});

router.post('/create', (req, res) => {
  const { errors, isValid } = validateCreateLobbyInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newLobby = new Lobby({
    name: req.body.name
  })

  newLobby
    .save()
    .then(lobby => res.json(lobby))
    .catch(err => console.log(err));
});

router.patch('/:lobbyId/join', (req, res) => {
  
  debugger
  Lobby.find({"_id": req.params.lobbyId }, (err, lobby) => {
    req.body
  })
    .catch(err => res.status(404).json({ nolobbiesfound: "No lobby found"}))
});

module.exports = router;