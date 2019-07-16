import {
  RECEIVE_USERS,
  RECEIVE_USER
} from '../actions/user_actions';

import {
  RECEIVE_CURRENT_USER,
} from '../actions/session_actions';

const initialState = {
};

export default function (state = initialState, action) {
  let nextState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_USERS:
      return nextState;
    case RECEIVE_USER:
      return nextState;
    case RECEIVE_CURRENT_USER:
      nextState[action.currentUser.id] = action.currentUser;      
      return nextState;
    default:
      return state;
  }
}