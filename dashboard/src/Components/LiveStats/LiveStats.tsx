import * as React from 'react';
import './liveStats.css';
import api from '../../services/api';
import { RunnerStatus, Stats } from '../../typings';
import { useInterval } from '../../hooks/useInterval';
import { Statistic, Row, Col, Button, Select, Badge } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { fetchStats } from '../../redux/actions/statsActions';
import { useDispatch } from 'react-redux';

export function LiveStats({ stats, status }: LiveStatsProps) {
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

  const badge = status === RunnerStatus.Running
    ? <Badge status="processing" text="Running" />
    : <Badge status="default" text="Stopped" />

  return <div className="live-stats">
    <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>Live Stats
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
    </h3>
    <Row gutter={20}>
      <Col span={4}>
        <Statistic title="Status" formatter={() => badge} />
      </Col>
      <Col span={4}>
        <Statistic title="Count" value={stats.count} />
      </Col>
      <Col span={6}>
        <Statistic title="Average Time(ms)" value={stats.average_time} precision={2} />
      </Col>
      <Col span={4}>
        <Statistic title="RPS" value={stats.rps} />
      </Col>
      <Col span={6}>
        <Statistic title="Error Count" value={stats.error_count} />
      </Col>
    </Row>
  </div>
}

interface LiveStatsProps {
  stats: Stats;
  status: RunnerStatus;
}