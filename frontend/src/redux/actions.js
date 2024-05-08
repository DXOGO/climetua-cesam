// Actions.js
import { 
  SET_SELECTED_CITY,
  SET_EXPANDED,
  TOGGLE_TOGGLE,
  SET_ACTIVE_BUTTON,
  FETCH_DATA_SUCCESS,
  FETCH_TEMPERATURE_DATA_SUCCESS,
  UPDATE_DATE,
} from './types';

export const setSelectedCity = (city) => (dispatch) => {
  try {
    dispatch({
      type: SET_SELECTED_CITY,
      payload: city,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const setExpanded = (isExpanded) => (dispatch) => {
  try {
    dispatch({
      type: SET_EXPANDED,
      payload: isExpanded,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const toggleToggle = (toggleName) => (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_TOGGLE,
      payload: toggleName,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const setActiveButton = (buttonName) => (dispatch) => {
  try {
    dispatch({
      type: SET_ACTIVE_BUTTON,
      payload: buttonName,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const fetchDataSuccess = (data) => (dispatch) => {
  try {
    dispatch({
      type: FETCH_DATA_SUCCESS,
      payload: data,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const fetchTemperatureDataSuccess = (data) => (dispatch) => {
  try {
    dispatch({
      type: FETCH_TEMPERATURE_DATA_SUCCESS,
      payload: data,
    });
  }
  catch (error) {
    console.error(error);
  }
}

export const updateDate = (date) => (dispatch) => {
  try {
    const serializedDate = date.toISOString();
    dispatch({
      type: UPDATE_DATE,
      payload: serializedDate,
    });
  }
  catch (error) {
    console.error(error);
  }
}
