import * as React from 'react';
import api from '../../services/api';
import { RunnerStatus, Stats } from '../../typings';
import './runner.css';
import { LiveStats } from '../../Components/LiveStats/LiveStats';
import { TestResult } from '../../Components/TestResult/TestResult';
import { Button, Input, PageHeader } from 'antd';

export function Runner(props: RunnerProps) {
  const [status, setStatus] = React.useState(RunnerStatus.Stopped);
  const [liveStats, setLiveStats] = React.useState((undefined) as unknown as Stats);
  const [url, setUrl] = React.useState('');
  const [workerCount, setWorkerCount] = React.useState(0);
  const [testResults, setTestResults] = React.useState<Stats[]>([{
    average_time: 1.2,
    count: 4,
    error_count: 0,
    rps: 0
  },
  {
    average_time: 1.2,
    count: 4,
    error_count: 0,
    rps: 0
  }]);

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
    setWorkerCount(e.currentTarget.valueAsNumber);
  }, []);


  return (
    <section className="runner-page">
      <PageHeader
        className="site-page-header"
        title="Runner"
      />
      <div className="runner-form">
        <Input placeholder="Url" value={url} onChange={onUrlChange} autoComplete="on" />
        <Input placeholder="Worker Count" type="number" value={workerCount} onChange={onWorkerCountChange} max={1000} />
        {
          status === RunnerStatus.Stopped
            ? <Button type="primary" onClick={onStartClick}>Start</Button>
            : <Button type="primary" onClick={onStopClick} danger>Stop</Button>
        }
      </div>
      {liveStats && <LiveStats stats={liveStats} getState={getState} status={status} />}
      {testResults.length > 0 && <h3>Previous Results</h3>}
      {testResults.map((result, index) => {
        return <TestResult stats={result} key={`test-result-${index}`} />
      })}
    </section >)
}

interface RunnerProps { }