const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  value: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: false
  }
});

module.exports = Score = mongoose.model('Score', ScoreSchema);