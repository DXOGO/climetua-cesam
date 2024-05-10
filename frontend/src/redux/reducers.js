// Reducers.js
import {
  SET_SELECTED_CITY,
  SET_EXPANDED,
  TOGGLE_TOGGLE,
  SET_ACTIVE_BUTTON,
  FETCH_DATA_SUCCESS,
  FETCH_DAILY_DATA_SUCCESS,
  UPDATE_DATE
} from './types';

const initialState = {
  selectedCity: null,
  toggles: ["temperature"],
  activeButton: "table",
  isExpanded: false,
  variableData: [],
  dailyData: [],
  currentDate: '2021-07-08T15:00:00.000Z',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CITY:
      return {
        ...state,
        selectedCity: action.payload,
      };
    case SET_EXPANDED:
      return {
        ...state,
        isExpanded: action.payload,
      };
    case TOGGLE_TOGGLE:
      const { payload } = action;
      const toggles = state.toggles.includes(payload)
        ? state.toggles.filter(item => item !== payload) // Remove if already toggled
        : [...state.toggles, payload]; // Add if not toggled
      return { ...state, toggles };
    case SET_ACTIVE_BUTTON:
      return {
        ...state,
        activeButton: action.payload,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        variableData: action.payload,
      };
    case FETCH_DAILY_DATA_SUCCESS:
      return {
        ...state,
        dailyData: action.payload,
      };
    case UPDATE_DATE:
      return {
        ...state,
        currentDate: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
