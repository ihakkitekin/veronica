import { RunnerStatus, Stats } from "../../typings";

/**
 * Mutation types
 */
export enum StatsMutations {
  SET_STATS = 'SET_STATS',
  SET_STATUS = 'SET_STATUS',
  ADD_RESULT = 'ADD_RESULT'
}

interface SetStatsMutation {
  type: typeof StatsMutations.SET_STATS;
  payload: Stats;
}

interface SetStatusMutation {
  type: typeof StatsMutations.SET_STATUS;
  payload: RunnerStatus;
}

interface AddResultMutation {
  type: typeof StatsMutations.ADD_RESULT;
  payload: Stats;
}

export type StatsMutationTypes = SetStatsMutation | SetStatusMutation | AddResultMutation;


/**
 * Mutations
 */
export function setStats(stats: Stats): StatsMutationTypes {
  return {
    type: StatsMutations.SET_STATS,
    payload: stats
  }
}

export function setStatus(status: RunnerStatus): StatsMutationTypes {
  return {
    type: StatsMutations.SET_STATUS,
    payload: status
  }
}

export function addResult(stats: Stats): StatsMutationTypes {
  return {
    type: StatsMutations.ADD_RESULT,
    payload: stats
  }
}