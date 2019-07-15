
import merge from 'lodash/merge';

import {
  RECEIVE_SCORES,
} from '../actions/score_actions';


export default (state = {}, action) => {
  switch(action.type){
    case RECEIVE_SCORES:
      return merge({}, action.scores);
    default:
      return state;
  }
}