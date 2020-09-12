import axios from 'axios';
import { RunnerResponse, ApiResponse } from '../typings';

async function getStats(): Promise<ApiResponse<RunnerResponse>> {
  try {
    const response = await axios.get<RunnerResponse>('/api/stats');
    const data = response.data;

    return { result: data };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}

async function startRunner(url: string, workerCount: number): Promise<ApiResponse<boolean>> {
  try {
    await axios.post('/api/runner/start', {
      url,
      worker_count: workerCount
    });

    return { result: true };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}

async function stopRunner(): Promise<ApiResponse<boolean>> {
  try {
    await axios.post('/api/runner/stop');

    return { result: true };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}

async function resetRunner(): Promise<ApiResponse<boolean>> {
  try {
    await axios.post('/api/runner/reset');

    return { result: true };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}


export default {
  getStats,
  startRunner,
  stopRunner,
  resetRunner
}