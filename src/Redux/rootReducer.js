import { combineReducers } from 'redux';
import tmxReducer from './reducer';
import indexReducer from './Reducer/projectData';
import qcDataReducer from './Reducer/qcProjectData';

const rootReducer = combineReducers({
  tmxData: tmxReducer,
  projectData: indexReducer,
  qcData: qcDataReducer,
});

export default rootReducer;
