// redux/store.js
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';  // Importing redux-thunk middleware
import rootReducer from '../Redux/reducer';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)  // Apply middleware during store creation
);

export default store;
