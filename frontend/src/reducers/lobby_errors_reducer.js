import {
  RECEIVE_LOBBY_ERRORS
} from '../actions/session_actions';

const _nullErrors = [];

const LobbyErrorsReducer = (state = _nullErrors, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_LOBBY_ERRORS:
      return action.errors;
    case RECEIVE_LOBBY:
      return _nullErrors;
    default:
      return state;
  }
};

export default LobbyErrorsReducer;