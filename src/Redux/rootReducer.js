import { combineReducers } from 'redux';
import tmxReducer from './reducer';
import indexReducer from './Reducer/projectData';
import qcDataReducer from './Reducer/qcProjectData';
import notiDataReducer from './Reducer/notiProjectData';
const rootReducer = combineReducers({
    tmxData: tmxReducer,
  projectData: indexReducer,
  qcData: qcDataReducer,
  notiData:notiDataReducer
});

export default rootReducer;
