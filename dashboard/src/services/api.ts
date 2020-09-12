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

async function startRunner(): Promise<ApiResponse<boolean>> {
  try {
    // TODO: Make this post
    await axios.get<RunnerResponse>('/api/runner/start');

    return { result: true };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}

async function stopRunner(): Promise<ApiResponse<boolean>> {
  try {
    // TODO: Make this post
    await axios.get<RunnerResponse>('/api/runner/stop');

    return { result: true };
  } catch (error) {
    const errorMessage = error.response?.data.message || error.message;

    return { error: errorMessage }
  }
}


export default {
  getStats,
  startRunner,
  stopRunner
}