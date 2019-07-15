
import * as ScoreboardApiUtil from '../util/score_api_util';

export const RECEIVE_SCORES = 'RECEIVE_SCORES';
export const RECEIVE_SCORE_ERRORS = 'RECEIVE_SCORE_ERRORS';

export const receiveScores = (scores) => {
  return {
    type: RECEIVE_SCORES,
    scores
  }  
};

export const receiveScoreErrors = (errors) => {
  return {
    type: RECEIVE_SCORE_ERRORS,
    errors
  }  
};


export const getScores = () => dispatch => {
  ScoreboardApiUtil.getScores()
    .then( scores =>  dispatch(receiveScores(scores)))
    .catch(errors => dispatch(receiveScoreErrors(errors)))
}

export const getScoresByUserId = (userId) => dispatch => {
  ScoreboardApiUtil.getScoresByUserId(userId)
    .then( scores =>  dispatch(receiveScores(scores)))
    .catch(errors => dispatch(receiveScoreErrors(errors)))
}

export const postScore = (value) => dispatch => {
  ScoreboardApiUtil.postScore(value)
    .then(scores => dispatch(receiveScores(scores)))
    .catch(errors => dispatch(receiveScoreErrors(errors)))
}