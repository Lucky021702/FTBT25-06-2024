// redux/actions.js
export const SET_FILENAME = 'SET_FILENAME';  // Correct action type constant

export const setFileName = (data) => ({
    type: SET_FILENAME,
    payload: data
});
