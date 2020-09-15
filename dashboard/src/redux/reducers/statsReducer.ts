import { RunnerStatus, Stats } from '../../typings';
import { StatsMutations, StatsMutationTypes } from '../mutations/statsMutations';

export interface StatsState {
  stats?: Stats,
  status: RunnerStatus,
  results: Stats[]
}

const initalState: StatsState = {
  status: RunnerStatus.Stopped,
  results: []
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