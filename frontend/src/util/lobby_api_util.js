import axios from 'axios';

export const fetchLobbies = () => {
  return axios.get('/api/lobbies')
}

export const createLobby = (lobbyData) => {
  return axios.post('/api/lobbies/create', lobbyData);
}