import * as React from 'react';
import './testResult.css';
import { Stats } from '../../typings';

export function TestResult({ stats }: TestResultProps) {
  return (
    <div className="test-result">
      <div className="flex flex-c test-result-stat">
        <div><b>Count</b></div>
        <div>{stats.count}</div>
      </div>
      <div className="flex flex-c test-result-stat">
        <div><b>Average Time</b></div>
        <div>{stats.average_time.toFixed(2)} ms</div>
      </div>
      <div className="flex flex-c test-result-stat">
        <div><b>RPS</b></div>
        <div>{stats.rps}</div>
      </div>
      <div className="flex flex-c test-result-stat">
        <div><b>Error Count</b></div>
        <div>{stats.error_count}</div>
      </div>
    </div>
  )
}

interface TestResultProps {
  stats: Stats;
}