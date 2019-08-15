const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LobbySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  hostPlayerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gameState: {
    type: Number,
    default: 0
  },
  gameMode: {
    type: Number,
    default: 0
    // default = multiplayer
  }
});

module.exports = Lobby = mongoose.model('Lobby', LobbySchema);