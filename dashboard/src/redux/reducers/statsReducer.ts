import { RunnerStatus, Stats } from '../../typings';
import { StatsMutations, StatsMutationTypes } from '../mutations/statsMutations';

export interface StatsState {
  stats?: Stats,
  status: RunnerStatus,
  results: Stats[]
}

const initalState: StatsState = {
  status: RunnerStatus.Stopped,
  results: [{
    average_time: 1.2,
    count: 4,
    error_count: 0,
    rps: 0
  },
  {
    average_time: 1.2,
    count: 4,
    error_count: 0,
    rps: 0
  }]
}

export function statsReducer(state: StatsState = initalState, action: StatsMutationTypes): StatsState {
  switch (action.type) {
    case StatsMutations.SET_STATS:
      return { ...state, stats: action.payload }
    case StatsMutations.SET_STATUS:
      return { ...state, status: action.payload }
    case StatsMutations.ADD_RESULT:
      return { ...state, results: [...state.results, action.payload] }
    default:
      return state;
  }
}