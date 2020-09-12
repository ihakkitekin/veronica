import * as React from 'react';
import api from '../../services/api';
import { Button, ButtonTypes } from '../../Components/Button/Button';
import { RunnerStatus, Stats } from '../../typings';
import './runner.css';
import { Input } from '../../Components/Input/Input';

export function Runner(props: RunnerProps) {
  const [status, setStatus] = React.useState(RunnerStatus.Stopped);
  const [stats, setStats] = React.useState((undefined) as unknown as Stats);
  const [url, setUrl] = React.useState('');
  const [workerCount, setWorkerCount] = React.useState(0);

  React.useEffect(() => {
    const getInitialState = async () => {
      const response = await api.getStats();

      if (response.result) {
        setStatus(response.result.status);
        setStats(response.result.stats);
      }
    }

    getInitialState();

    const interval = setInterval(getInitialState, 3000);

    return () => {
      clearInterval(interval);
    }
  }, []);

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


  const onUrlChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  const onWorkerCountChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const workerCount = e.target.valueAsNumber;

    if (workerCount >= 0) {
      setWorkerCount(workerCount);
    }
  }, []);


  return (
    <section className="runner-page">
      <div className="runner-form">
        <Input label="Url" onChange={onUrlChange} />
        <Input label="Worker Count" type="number" onChange={onWorkerCountChange} min={0} max={1000} />
        {
          status === RunnerStatus.Stopped
            ? <Button buttonType={ButtonTypes.Success} onClick={onStartClick}>Start</Button>
            : <Button buttonType={ButtonTypes.Error} onClick={onStopClick}>Stop</Button>
        }
      </div>


      {stats &&
        <div>
          <div><b>Count: </b> {stats.count}</div>
          <div><b>Average Time: </b> {stats.average_time.toFixed(2)} ms</div>
          <div><b>Error Count: </b> {stats.error_count}</div>
        </div>
      }
    </section >)
}

interface RunnerProps { }