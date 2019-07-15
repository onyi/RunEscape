import {
  RECEIVE_LOBBY_ERRORS,
  RECEIVE_LOBBY,
  RECEIVE_LOBBIES
} from '../actions/lobby_actions';

const _nullErrors = [];

const LobbyErrorsReducer = (state = _nullErrors, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_LOBBY_ERRORS:
      return action.errors;
    case RECEIVE_LOBBY:
      return _nullErrors;
    case RECEIVE_LOBBIES:
      return _nullErrors;
    default:
      return state;
  }
};

export default LobbyErrorsReducer;