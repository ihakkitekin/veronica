import * as React from 'react';
import api from '../../services/api';
import { Button, ButtonTypes } from '../../Components/Button/Button';
import { RunnerStatus, Stats } from '../../typings';
import { Input } from '../../Components/Input/Input';
import { useInterval } from '../../hooks/useInterval';
import './runner.css';

export function Runner(props: RunnerProps) {
  const [status, setStatus] = React.useState(RunnerStatus.Stopped);
  const [stats, setStats] = React.useState((undefined) as unknown as Stats);
  const [url, setUrl] = React.useState('');
  const [workerCount, setWorkerCount] = React.useState(0);
  const [fetchPeriod, setFetchPeriod] = React.useState(0);

  React.useEffect(() => {
    getState();
  }, []);

  const getState = React.useCallback(async () => {
    const response = await api.getStats();

    if (response.result) {
      setStatus(response.result.status);
      setStats(response.result.stats);
    }
  }, []);


  useInterval(fetchPeriod, getState);

  const onStartClick = React.useCallback(async () => {
    if (!url || !workerCount) return;

    const response = await api.startRunner(url, workerCount);

    if (response.result) {
      setStatus(RunnerStatus.Running);
    }
  }, [url, workerCount]);

  const onStopClick = React.useCallback(async () => {
    const response = await api.stopRunner();

    if (response.result) {
      setStatus(RunnerStatus.Stopped);
    }
  }, []);

  const onResetClick = React.useCallback(async () => {
    await api.resetRunner();
  }, []);


  const onUrlChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  }, []);

  const onWorkerCountChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const workerCount = e.currentTarget.valueAsNumber;

    if (workerCount >= 0) {
      setWorkerCount(workerCount);
    }
  }, []);

  const onFetchPeriodChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = Number(e.currentTarget.value);
    if (period >= 0) {
      setFetchPeriod(period);
    }
  }, []);


  return (
    <section className="runner-page">
      <div className="runner-form">
        <Input label="Url" value={url} onChange={onUrlChange} />
        <Input label="Worker Count" type="number" value={workerCount} onChange={onWorkerCountChange} min={0} max={1000} />
        {
          status === RunnerStatus.Stopped
            ? <Button buttonType={ButtonTypes.Success} onClick={onStartClick}>Start</Button>
            : <Button buttonType={ButtonTypes.Error} onClick={onStopClick}>Stop</Button>
        }
      </div>


      {stats &&
        <div className="runner-stats">
          <div><b>Count: </b> {stats.count}</div>
          <div><b>Average Time: </b> {stats.average_time.toFixed(2)} ms</div>
          <div><b>RPS: </b> {stats.rps}</div>
          <div><b>Error Count: </b> {stats.error_count}</div>
          <div>
            <b>Auto Fetch: </b>
            <select onChange={onFetchPeriodChange}>
              <option value="0">Turn Off</option>
              <option value="1000">1s</option>
              <option value="5000">5s</option>
              <option value="10000">10s</option>
            </select>
          </div>
          <Button buttonType={ButtonTypes.Error} onClick={onResetClick}>Reset</Button>
        </div>
      }
    </section >)
}

interface RunnerProps { }