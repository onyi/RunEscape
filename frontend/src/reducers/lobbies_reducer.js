import {
  RECEIVE_LOBBIES,
  RECEIVE_LOBBY
} from '../actions/lobby_actions';

const initialState = {
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_LOBBIES:      
      return action.lobbies;
    case RECEIVE_LOBBY:
      let nextState = Object.assign({}, state);
      let lobby = action.lobby;
      nextState[lobby.id] = lobby
      return nextState;
    default:
      return state;
  }
}