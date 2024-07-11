// reducer.js
const initialState = {
    tmxData: [],
  };

  
  const tmxReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TMX_DATA':
        return {
          ...state,
          tmxData: [...state.tmxData, ...action.payload],
        };
      default:
        return state;
    }
  };
  
  export default tmxReducer;
  