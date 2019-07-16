import {
  RECEIVE_LOBBIES,
  RECEIVE_LOBBY
} from '../actions/lobby_actions';

const initialState = {
};

export default function (state = initialState, action) {
  let nextState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_LOBBIES:
      let lobbies = action.lobbies
      lobbies.map(lobby => nextState[lobby._id] = lobby)
      return nextState;
    case RECEIVE_LOBBY:
      let lobby = action.lobby;
      nextState[lobby._id] = lobby
      return nextState;
    default:
      return state;
  }
}