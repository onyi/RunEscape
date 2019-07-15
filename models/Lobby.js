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
  }]
});

module.exports = Lobby = mongoose.model('Lobby', LobbySchema);