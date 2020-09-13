import { Dispatch } from 'redux';
import { AppState } from '../reducers';
import api from '../../services/api';
import { addResult, setStats, setStatus } from '../mutations/statsMutations';
import { RunnerStatus } from '../../typings';

export const FETCH_STATS = 'FETCH_STATS';

/**
 * Action types
 */
interface FetchStatsAction {
  type: typeof FETCH_STATS;
}

export type StatsActionTypes = FetchStatsAction;


/**
 * Actions
 */
export function fetchStats() {
  return async function (dispatch: Dispatch, getState: () => AppState): Promise<void> {
    const response = await api.getStats();

    if (response.result) {
      dispatch(setStats(response.result.stats));
      dispatch(setStatus(response.result.status));
    }
  }
}

export function startRunner(url: string, workerCount: number) {
  return async function (dispatch: Dispatch, getState: () => AppState): Promise<void> {
    const response = await api.startRunner(url, workerCount);

    if (response.result) {
      dispatch(setStatus(RunnerStatus.Running));
      fetchStats();
    }
  }
}

export function stopRunner() {
  return async function (dispatch: Dispatch, getState: () => AppState): Promise<void> {
    const response = await api.stopRunner();

    if (response.result) {
      dispatch(setStatus(RunnerStatus.Stopped));
      dispatch(addResult(response.result));
    }
  }
}