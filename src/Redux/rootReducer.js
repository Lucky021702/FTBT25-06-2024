import { combineReducers } from 'redux';
import tmxReducer from './reducer';
import indexReducer from './Reducer/projectData';

const rootReducer = combineReducers({
    tmxData: tmxReducer,
  projectData: indexReducer,
});

export default rootReducer;
