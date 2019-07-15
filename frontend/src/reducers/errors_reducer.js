import { combineReducers } from 'redux';

import SessionErrorsReducer from './session_errors_reducer';
import ScoreErrorsReducer from './score_errors_reducer';

export default combineReducers({
  session: SessionErrorsReducer,
  score: ScoreErrorsReducer
});

