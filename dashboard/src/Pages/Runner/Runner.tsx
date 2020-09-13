import * as React from 'react';
import api from '../../services/api';
import { Button, ButtonTypes } from '../../Components/Button/Button';
import { RunnerStatus, Stats } from '../../typings';
import { Input } from '../../Components/Input/Input';
import './runner.css';
import { LiveStats } from '../../Components/LiveStats/LiveStats';
import { TestResult } from '../../Components/TestResult/TestResult';

export function Runner(props: RunnerProps) {
  const [status, setStatus] = React.useState(RunnerStatus.Stopped);
  const [liveStats, setLiveStats] = React.useState((undefined) as unknown as Stats);
  const [url, setUrl] = React.useState('');
  const [workerCount, setWorkerCount] = React.useState(0);
  const [testResults, setTestResults] = React.useState<Stats[]>([]);

  React.useEffect(() => {
    getState();
  }, []);

  const getState = React.useCallback(async () => {
    const response = await api.getStats();

    if (response.result) {
      setStatus(response.result.status);
      setLiveStats(response.result.stats);
    }
  }, []);

  const onStartClick = React.useCallback(async () => {
    if (!url || !workerCount) return;

    const response = await api.startRunner(url, workerCount);

    if (response.result) {
      setStatus(RunnerStatus.Running);
      getState();
    }
  }, [url, workerCount]);

  const onStopClick = React.useCallback(async () => {
    const response = await api.stopRunner();

    if (response.result) {
      setStatus(RunnerStatus.Stopped);
      setTestResults((prevResults) => {
        return [...prevResults, response.result!];
      })
    }
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


  return (
    <section className="runner-page">
      <div className="runner-form">
        <Input label="Url" value={url} onChange={onUrlChange} autoComplete="on" />
        <Input label="Worker Count" type="number" value={workerCount} onChange={onWorkerCountChange} min={0} max={1000} />
        {
          status === RunnerStatus.Stopped
            ? <Button buttonType={ButtonTypes.Success} onClick={onStartClick}>Start</Button>
            : <Button buttonType={ButtonTypes.Error} onClick={onStopClick}>Stop</Button>
        }
      </div>
      {liveStats && <LiveStats stats={liveStats} getState={getState} />}
      {testResults.map((result, index) => {
        return <TestResult stats={result} key={`test-result-${index}`} />
      })}
    </section >)
}

interface RunnerProps { }