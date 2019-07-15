import Scoreboard from './scoreboard';

import {connect} from 'react-redux';

import {
  getScores,
  getScoresByUserId,
  postScore
} from '../../actions/score_actions';

const msp = (state = {}, ownProps) => {
  return {
    scores: state.entities.scores
  }
};

const mdp = dispatch => {
  return {
    getScores: () => dispatch(getScores()),
    getScoresByUserId: (userId) => dispatch(getScoresByUserId(userId)),
    postScore: (value) => dispatch(postScore(value))
  }
};

export default connect(msp, mdp)(Scoreboard)