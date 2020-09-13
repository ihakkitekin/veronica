import * as React from 'react';
import './testResult.css';
import { Stats } from '../../typings';
import { Statistic, Row, Col, Button, Select, Badge } from 'antd';

export function TestResult({ stats }: TestResultProps) {
  // return <div className="test-result">
  //   <h4>Test Result</h4>
  //   <div><b>Count: </b> {stats.count}</div>
  //   <div><b>Average Time: </b> {stats.average_time.toFixed(2)} ms</div>
  //   <div><b>RPS: </b> {stats.rps}</div>
  //   <div><b>Error Count: </b> {stats.error_count}</div>
  // </div>

  return (<div className="test-result">
    <Row gutter={20}>
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
  </div>)
}

interface TestResultProps {
  stats: Stats;
}