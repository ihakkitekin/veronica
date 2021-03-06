import * as React from 'react';
import './liveStats.css';
import api from '../../services/api';
import { RunnerStatus, Stats } from '../../typings';
import { useInterval } from '../../hooks/useInterval';
import { Button, Select, Badge, Card } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { fetchStats, stopRunner } from '../../redux/actions/statsActions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';

export function LiveStats(props: LiveStatsProps) {
  const status = useSelector<AppState, RunnerStatus>(state => state.statsReducer.status);
  const stats = useSelector<AppState, Stats | undefined>(state => state.statsReducer.stats);
  const [fetchPeriod, setFetchPeriod] = React.useState(0);
  const dispatch = useDispatch();

  const intervalHandler = React.useCallback(() => {
    dispatch(fetchStats());
  }, []);

  useInterval(fetchPeriod, intervalHandler);

  const onFetchPeriodChange = React.useCallback((value: string) => {
    const period = Number(value);
    if (period >= 0) {
      setFetchPeriod(period);
    }
  }, []);

  const onResetClick = React.useCallback(async () => {
    await api.resetRunner();
  }, []);

  const onStopClick = React.useCallback(() => {
    dispatch(stopRunner());
  }, []);


  const badge = status === RunnerStatus.Running
    ? <Badge status="processing" style={{ lineHeight: 1 }} />
    : <Badge status="default" style={{ lineHeight: 1 }} />


  if (!stats) return null;

  return <Card hoverable>
    <div className="live-stats">
      <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>Live Stats
        <div>
          <SyncOutlined spin={fetchPeriod > 0} style={{ marginRight: 5 }} />
          <Select onChange={onFetchPeriodChange} defaultValue="0" style={{ width: 60, marginRight: 5 }} size="small">
            <Select.Option value="0">Off</Select.Option>
            <Select.Option value="1000">1s</Select.Option>
            <Select.Option value="5000">5s</Select.Option>
            <Select.Option value="10000">10s</Select.Option>
          </Select>
          <Button onClick={onResetClick} size="small" danger>Reset</Button>
        </div>
      </h4>
      <div className="live-stats-wrapper">
        <div className="flex flex-c live-stats-stat">
          <div><b>Status</b></div>
          <div>{badge}</div>
        </div>
        <div className="flex flex-c live-stats-stat">
          <div><b>Count</b></div>
          <div>{stats.count}</div>
        </div>
        <div className="flex flex-c live-stats-stat">
          <div><b>Average Time</b></div>
          <div>{stats.average_time.toFixed(2)} ms</div>
        </div>
        <div className="flex flex-c live-stats-stat">
          <div><b>RPS</b></div>
          <div>{stats.rps}</div>
        </div>
        <div className="flex flex-c live-stats-stat">
          <div><b>Error Count</b></div>
          <div>{stats.error_count}</div>
        </div>
      </div>
      {status === RunnerStatus.Running && <Button type="primary" className="runner-stop-button" onClick={onStopClick} danger>Stop</Button>}
    </div>
  </Card>
}

interface LiveStatsProps { }