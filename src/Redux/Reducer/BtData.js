const initialState = {
  btData: [],
};

const btDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BT_DATA":
      console.log("Payload received:", action.payload); // Log payload for debugging
      return {
        ...state,
        btData: action.payload,
      };
    default:
      return state;
  }
};

export default btDataReducer;
