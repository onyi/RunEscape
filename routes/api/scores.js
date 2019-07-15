const express = require('express');
const router = express.Router();
const passport = require('passport');


const Score = require('../../models/Score');
const validateScoreInput = require('../../validation/scores');


router.get('/', (req, res) => {
  Score.find()
    .sort({ value: -1 })
    .limit(10)
    .then( scores => res.json(scores) )
    .catch( err => res.status(404).json({ noscorefound: 'No score info found'  }));
});

router.get('/:user_id', 
  (req, res) => {
    console.log(`User ID: ${req.params.user_id}`);
    Score.find({ userId: req.params.user_id })
      .sort({ value: 1 })
      .then( scores => res.json(scores) )
      .catch( err => 
        res.status(404).json({ noscorefound: 'No score info found for this user'  }));
});

router.post('/', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateScoreInput(req.body);
    console.log(`Request: ${JSON.stringify(req.body)}`);

    if(!isValid){
      return res.status(400).json(errors);
    }

    const newScore = new Score({
      value: req.body.value,
      userId: req.user.id
    });
    console.log(`New Score Object: ${newScore}`);
    newScore
      .save()
      .then( score => res.json(score))
      .catch( err => console.log(err));

});

module.exports = router;