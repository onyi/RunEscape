import axios from 'axios';

export const fetchLobbies = () => {
  return axios.get('/api/lobbies')
}

export const createLobby = (lobbyData) => {
  return axios.post('/api/lobbies/create', lobbyData);
}

export const joinLobby = (lobbyId, currentUserId) => {
  return axios.patch(`api/lobbies/${lobbyId}/join`, {currentUserId: currentUserId});
}
