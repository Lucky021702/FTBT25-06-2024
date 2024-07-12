import { SET_INDEX_NAME } from '../actionTypes'; // Import action type

const initialStateIndex = {
  indexNameData: [],
};

const indexReducer = (state = initialStateIndex, action) => {
    switch (action.type) {
      case SET_INDEX_NAME:
        return {
          ...state,
          indexNameData: [...state.indexNameData, ...action.payload],
        };
      default:
        return state;
    }
  };

export default indexReducer;