import {connect} from 'react-redux';

import Game from './game';

import {
  postScore,
  getScores
} from '../../actions/score_actions';

const msp = (state = {}) => {
  return {
    scores: Object.values(state.entities.scores)
  }
};

const mdp = dispatch => ({
  postScore: (value) => dispatch(postScore(value)),
  getScores: () => dispatch(getScores())
});

export default connect(msp, mdp)(Game);