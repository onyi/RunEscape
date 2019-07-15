import * as APIUtil from '../util/lobby_api_util';

export const RECEIVE_LOBBIES = 'RECEIVE_LOBBIES';
export const RECEIVE_LOBBY = 'RECEIVE_LOBBY';
export const RECEIVE_LOBBY_ERRORS = 'RECEIVE_LOBBY_ERRORS';

export const receiveLobbies = lobbies => ({
  type: RECEIVE_LOBBIES,
  lobbies
})

export const receiveLobby = lobby => ({
  type: RECEIVE_LOBBY,
  lobby
})

export const receiveErrors = errors => ({
  type: RECEIVE_LOBBY_ERRORS,
  errors
})

export const fetchLobbies = () => dispatch => (
  APIUtil.fetchLobbies()
    .then(res => dispatch(receiveLobbies(res.data)),
      err => dispatch(receiveErrors(err.response.data)))
);

export const createLobby = lobby => dispatch => (
  APIUtil.createLobby(lobby)
    .then(res => dispatch(receiveLobby(res.data)),
      err => dispatch(receiveErrors(err.response.data)))
);
