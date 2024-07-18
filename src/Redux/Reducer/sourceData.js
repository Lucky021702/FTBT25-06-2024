const initialState = {
  sourceData: [],
};

const sourceDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SOURCE_DATA":
      console.log("Payload received:", action.payload); // Log payload for debugging
      return {
        ...state,
        sourceData: action.payload,
      };
    default:
      return state;
  }
};

export default sourceDataReducer;
