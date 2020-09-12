import * as React from 'react';
import api from '../../services/api';
import { Button, ButtonTypes } from '../../Components/Button/Button';
import { RunnerStatus, Stats } from '../../typings';
import './runner.css';

export function Runner(props: RunnerProps) {
  const [status, setStatus] = React.useState(RunnerStatus.Stopped);
  const [stats, setStats] = React.useState((undefined) as unknown as Stats);

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
    const response = await api.startRunner();

    if (response.result) {
      setStatus(RunnerStatus.Running);
    }
  }, []);

  const onStopClick = React.useCallback(async () => {
    const response = await api.stopRunner();

    if (response.result) {
      setStatus(RunnerStatus.Stopped);
    }
  }, []);


  return (
    <section className="stats-page">
      {
        status === RunnerStatus.Stopped
          ? <Button buttonType={ButtonTypes.Success} onClick={onStartClick}>Start</Button>
          : <Button buttonType={ButtonTypes.Error} onClick={onStopClick}>Stop</Button>
      }

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