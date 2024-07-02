// redux/reducers.js
import { SET_FILENAME } from './actions';  // Correct import path to action type

const initialState = {
    savedData: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILENAME:
            return {
                ...state,
                savedData: action.payload
            };
        default:
            return state;
    }
};

export default rootReducer;
