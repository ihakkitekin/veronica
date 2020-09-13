import * as React from 'react';
import './testResult.css';
import { Stats } from '../../typings';

export function TestResult({ stats }: TestResultProps) {
  return <div className="test-result">
    <h4>Test Result</h4>
    <div><b>Count: </b> {stats.count}</div>
    <div><b>Average Time: </b> {stats.average_time.toFixed(2)} ms</div>
    <div><b>RPS: </b> {stats.rps}</div>
    <div><b>Error Count: </b> {stats.error_count}</div>
  </div>
}

interface TestResultProps {
  stats: Stats;
}