import { combineReducers } from 'redux';
import lobbies from './lobbies_reducer';

const EntitiesReducer = combineReducers({
  lobbies
});

export default EntitiesReducer;