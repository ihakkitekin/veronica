import * as React from 'react';
import './runnerInitializeForm.css';
import { Button, Input, Card } from 'antd';
import { RunnerStatus, TaskRequest } from '../../typings';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { startRunner } from '../../redux/actions/statsActions';
import { DeleteFilled } from '@ant-design/icons';


type TaskMap = {
  [key: string]: TaskRequest
}

type TaskKey = 'url' | 'weight';

export function RunnerInitializeForm(props: RunnerInitializeFormProps) {
  const status = useSelector<AppState, RunnerStatus>(state => state.statsReducer.status);

  const dispatch = useDispatch();

  const [workerCount, setWorkerCount] = React.useState<number>();
  const [taskMap, setTaskMap] = React.useState<TaskMap>({});
  const taskIdRef = React.useRef<number>(0);

  const onWorkerCountChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkerCount(event.currentTarget.valueAsNumber);
  }, []);

  const onTaskChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, key: TaskKey, id: string) => {
    const value = key === 'weight' ? event.currentTarget.valueAsNumber : event.currentTarget.value;

    setTaskMap((prev) => {
      const tasks = { ...prev };

      // @ts-ignore
      tasks[id][key] = value;

      return tasks;
    });
  }, []);

  const onAddTask = React.useCallback(() => {
    const id = (++taskIdRef.current).toString();

    setTaskMap((prev) => {
      return { ...prev, [id]: { url: '', weight: NaN } }
    })
  }, [taskMap]);

  const onTasksStart = React.useCallback(() => {
    const tasks = Object.values(taskMap).map(val => val)

    if (!tasks.length || !workerCount) return;

    dispatch(startRunner(tasks, workerCount));
  }, [taskMap, workerCount]);

  const onTaskDelete = React.useCallback((id) => {
    setTaskMap((prev) => {
      const tasks = { ...prev };

      delete tasks[id];

      return tasks;
    })
  }, []);


  const tasksLength = Object.keys(taskMap).length;

  return (
    <Card className="runner-initialize-form" hoverable>
      <h4>Set Up Runners</h4>
      <Input placeholder="Worker Count" className="runner-field" type="number" value={workerCount} onChange={onWorkerCountChange} max={1000} />
      {Object.keys(taskMap).map((id) => {
        const task = taskMap[id];

        return <div className="runner-task runner-field" key={`task-${id}`}>
          <Input placeholder="Url" size="small" value={task.url} onChange={(e) => onTaskChange(e, 'url', id)} autoComplete="on" />
          <Input placeholder="Weight" size="small" type="number" value={task.weight} onChange={(e) => onTaskChange(e, 'weight', id)} />
          <DeleteFilled onClick={() => onTaskDelete(id)} />
        </div>
      })}
      {status === RunnerStatus.Stopped && <Button onClick={onAddTask} type="primary">Add Task</Button>}
      {
        status === RunnerStatus.Stopped && tasksLength > 0 && <Button type="primary" onClick={onTasksStart}>Start</Button>
      }
    </Card >
  )
}

interface RunnerInitializeFormProps { }