import * as React from 'react';
import './liveStats.css';
import api from '../../services/api';
import { Stats } from '../../typings';
import { Button, ButtonTypes } from '../Button/Button';
import { useInterval } from '../../hooks/useInterval';

export function LiveStats({ stats, getState }: LiveStatsProps) {
  const [fetchPeriod, setFetchPeriod] = React.useState(0);

  useInterval(fetchPeriod, getState);

  const onFetchPeriodChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = Number(e.currentTarget.value);
    if (period >= 0) {
      setFetchPeriod(period);
    }
  }, []);

  const onResetClick = React.useCallback(async () => {
    await api.resetRunner();
  }, []);

  return <div className="live-stats">
    <h3>Live Stats</h3>
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

interface LiveStatsProps {
  stats: Stats;
  getState: Function;
}