import { combineReducers } from 'redux';
import lobbies from './lobbies_reducer';
import scores from './scores_reducer';

const EntitiesReducer = combineReducers({
  lobbies,
  scores
});

export default EntitiesReducer;