import Scoreboard from './scoreboard';

import {connect} from 'react-redux';

import {
  getScores,
  getScoresByUserId,
  postScore
} from '../../util/score_api_util';

const msp = (state = { entities: { scores: {} }}, ownProps) => {
  return {
    // scores: state.entities.scores
  }
};

const mdp = dispatch => {
  return {
    getScores: () => dispatch(getScores())
  }
};

export default connect(msp, mdp)(Scoreboard)