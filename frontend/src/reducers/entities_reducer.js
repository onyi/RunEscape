import { combineReducers } from 'redux';
import lobbies from './lobbies_reducer';
import scores from './scores_reducer';
import users from './users_reducer';

const EntitiesReducer = combineReducers({
  users,
  lobbies,
  scores
});

export default EntitiesReducer;