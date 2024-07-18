import { SET_TMX_DATA, SET_INDEX_NAME, SET_QC_DATA} from './actionTypes';

export const setTmxData = (newData) => ({
  type: SET_TMX_DATA,
  payload: newData,
});

export const setIndexName = (indexName) => ({
  type: SET_INDEX_NAME,
  payload: indexName,
});

export const setQcData = (qcData) => ({
  type: SET_QC_DATA,
  payload: qcData,
});

export const setNoti = (qcData) => ({
  type: "SET_NOTI_DATA",
  payload: qcData,
});
export const setBtData = (btData) => ({
  type: "SET_BT_DATA",
  payload: btData,
});

export const setSourceData = (sourceData) => ({
  type: "SET_SOURCE_DATA",
  payload: sourceData,
});
 
