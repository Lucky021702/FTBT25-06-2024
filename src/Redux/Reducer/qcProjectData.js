// reducers/qcDataReducer.js
import { SET_QC_DATA } from '../actionTypes';

const initialState = {
  qcData: [],
};

const qcDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_QC_DATA:
      console.log("Payload received:", action.payload); // Log payload for debugging
      return {
        ...state,
        qcData: action.payload,
      };
    default:
      return state;
  }
};

export default qcDataReducer;
