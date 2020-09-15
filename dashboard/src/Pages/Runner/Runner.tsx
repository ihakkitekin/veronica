import * as React from 'react';
import { RunnerStatus, Stats } from '../../typings';
import './runner.css';
import { LiveStats } from '../../Components/LiveStats/LiveStats';
import { TestResult } from '../../Components/TestResult/TestResult';
import { Button, Input, PageHeader, Row, Col, Card, Layout } from 'antd';
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
    <Layout.Content className="runner-page">
      <h1 style={{ textAlign: 'center' }}>Runner</h1>
      <Row justify="space-between" gutter={24}>
        <Col span={10}>
          <Card className="runner-form" hoverable>
            <Input placeholder="Url" value={url} onChange={onUrlChange} autoComplete="on" />
            <Input placeholder="Worker Count" type="number" value={workerCount} onChange={onWorkerCountChange} max={1000} />
            {
              status === RunnerStatus.Stopped
              ? <Button type="primary" onClick={onStartClick}>Start</Button>
              : <Button type="primary" onClick={onStopClick} danger>Stop</Button>
            }
          </Card >
        </Col>
        <Col span={12}>
          {liveStats && <Card style={{ width: 'fit-content' }} hoverable><LiveStats stats={liveStats} status={status} /></Card>}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={10}>
          {testResults.length > 0 && <h3>Previous Results</h3>}
          {testResults.map((result, index) => {
            return <Card key={`test-result-${index}`} hoverable><TestResult stats={result} /></Card>
          })}
        </Col>
      </Row>
    </Layout.Content >)
}

interface RunnerProps { }