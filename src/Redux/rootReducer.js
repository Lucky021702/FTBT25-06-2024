import { combineReducers } from 'redux';
import tmxReducer from './reducer';
import indexReducer from './Reducer/projectData';
import qcDataReducer from './Reducer/qcProjectData';
import notiDataReducer from './Reducer/notiProjectData';
import BtDataReducer from './Reducer/BtData';
import SourceDataReducer from './Reducer/sourceData';

const rootReducer = combineReducers({
    tmxData: tmxReducer,
  projectData: indexReducer,
  qcData: qcDataReducer,
  notiData:notiDataReducer,
  btData:BtDataReducer,
  sourceData:SourceDataReducer
});

export default rootReducer;
