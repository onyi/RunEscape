import axios from 'axios';

export const getScores = () => {
  return axios.get('/api/scores');
};

export const getScoresByUserId = (userId) => {
  return axios.get(`/api/scores/${userId}`);
};

export const postScore = (value) => {
  return axios.post('/api/scores/', { value });
}