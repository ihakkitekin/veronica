import * as React from 'react';
import { RunnerStatus, Stats } from '../../typings';
import './runner.css';
import { LiveStats } from '../../Components/LiveStats/LiveStats';
import { TestResult } from '../../Components/TestResult/TestResult';
import { Button, Input, PageHeader } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { fetchStats, startRunner, stopRunner } from '../../redux/actions/statsActions';

export function Runner(props: RunnerProps) {
  const status = useSelector<AppState, RunnerStatus>(state => state.statsReducer.status);
  const liveStats = useSelector<AppState, Stats | undefined>(state => state.statsReducer.stats);
  const testResults = useSelector<AppState, Stats[]>(state => state.statsReducer.results);

  const [url, setUrl] = React.useState('');
  const [workerCount, setWorkerCount] = React.useState(0);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchStats());
  }, []);

  const onStartClick = React.useCallback(() => {
    if (!url || !workerCount) return;

    dispatch(startRunner(url, workerCount));
  }, [url, workerCount]);

  const onStopClick = React.useCallback(() => {
    dispatch(stopRunner());
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
      {liveStats && <LiveStats stats={liveStats} status={status} />}
      {testResults.length > 0 && <h3>Previous Results</h3>}
      {testResults.map((result, index) => {
        return <TestResult stats={result} key={`test-result-${index}`} />
      })}
    </section >)
}

interface RunnerProps { }