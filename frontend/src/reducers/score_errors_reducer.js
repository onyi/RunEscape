import {
RECEIVE_SCORE_ERRORS
} from '../actions/score_actions';

const ScoreErrorsReducer = (state = [], action) => {
  Object.freeze(state);
  switch(action.type){
    case(RECEIVE_SCORE_ERRORS):
      return action.errors;
    default: 
      return state
  }
}

export default ScoreErrorsReducer;