import { combineReducers } from 'redux';
import { statsReducer, StatsState } from './statsReducer';

export interface AppState {
  statsReducer: StatsState
}

export default combineReducers({ statsReducer });