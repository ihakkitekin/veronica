import * as React from 'react';
import './runner.css';
import { LiveStats } from '../../Components/LiveStats/LiveStats';
import { useDispatch } from 'react-redux';
import { fetchStats } from '../../redux/actions/statsActions';
import { RunnerInitializeForm } from '../../Components/RunnerInitializeForm/RunnerInitializeForm';
import { PreviousResults } from '../../Components/PreviousResults/PreviousResults';

export function Runner(props: RunnerProps) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchStats());
  }, []);

  return (
    <div className="runner-page">
      <h1 style={{ textAlign: 'center' }}>Runner</h1>
      <div className="runner-page-content">
        <div className="runner-page-content-left">
          <RunnerInitializeForm />
          <PreviousResults />
        </div>
        <div className="runner-page-content-right">
          <LiveStats />
        </div>
      </div>
    </div>)
}

interface RunnerProps { }