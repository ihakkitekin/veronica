import { Card } from 'antd';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { Stats } from '../../typings';
import { TestResult } from '../TestResult/TestResult';
import './previousResults.css';


export function PreviousResults(props: PreviousResultsProps) {
  const testResults = useSelector<AppState, Stats[]>(state => state.statsReducer.results);

  return testResults.length > 0 ? <Card className="previous-results" hoverable>
    <h4>Previous Results</h4>
    {testResults.map((result, index) => {
      return <TestResult key={`test-result-${index}`} stats={result} />
    })}
  </Card> : null;
}

interface PreviousResultsProps { }

