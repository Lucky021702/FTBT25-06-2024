import { SET_TMX_DATA, SET_INDEX_NAME } from './actionTypes';

export const setTmxData = (newData) => ({
  type: SET_TMX_DATA,
  payload: newData,
});

export const setIndexName = (indexName) => ({
  type: SET_INDEX_NAME,
  payload: indexName,
});
