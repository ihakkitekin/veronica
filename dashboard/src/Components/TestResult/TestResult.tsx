import * as React from 'react';
import './testResult.css';
import { Stats } from '../../typings';
import { Row, Col } from 'antd';

export function TestResult({ stats }: TestResultProps) {
  return (<div className="test-result">
    <Row gutter={14}>
      <Col span={3}>
        <div className="flex flex-c test-result-stat">
          <div><b>Count</b></div>
          <div>{stats.count}</div>
        </div>
      </Col>
      <Col span={4}>
        <div className="flex flex-c test-result-stat">
          <div><b>Average Time</b></div>
          <div>{stats.average_time.toFixed(2)} ms</div>
        </div>
      </Col>
      <Col span={3}>
        <div className="flex flex-c test-result-stat">
          <div><b>RPS</b></div>
          <div>{stats.rps}</div>
        </div>
      </Col>
      <Col span={4}>
        <div className="flex flex-c test-result-stat">
          <div><b>Error Count</b></div>
          <div>{stats.error_count}</div>
        </div>
      </Col>
    </Row>
  </div>)
}

interface TestResultProps {
  stats: Stats;
}