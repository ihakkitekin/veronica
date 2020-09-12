export interface RunnerResponse {
  stats: Stats;
  status: RunnerStatus;
}

export interface Stats {
  count: number;
  error_count: number;
  average_time: number;
  rps: number;
}

export interface Error {
  message: string;
}

export interface ApiResponse<T> {
  result?: T;
  error?: Error;
}

export enum RunnerStatus {
  Stopped = 'Stopped',
  Running = 'Running'
}