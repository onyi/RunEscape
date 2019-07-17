import axios from 'axios';

export const fetchLobbies = () => {
  return axios.get('/api/lobbies')
}

export const fetchLobby = lobbyId => {
  return axios.get(`/api/lobbies/${lobbyId}`);
}

export const createLobby = (lobbyData) => {
  return axios.post('/api/lobbies/create', lobbyData);
}

export const joinLobby = (lobbyId, currentUserId) => {
  return axios.patch(`api/lobbies/${lobbyId}/join`, {currentUserId: currentUserId});
}
