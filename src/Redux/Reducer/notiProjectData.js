const initialState = {
    notiData: [],
  };
   
  const notiDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_NOTI_DATA":
        console.log("Payload received:", action.payload); 
        return {
          ...state,
          notiData: action.payload,
        };
      default:
        return state;
    }
  };
   
  export default notiDataReducer;