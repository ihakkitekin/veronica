use crate::task::Task;
use crate::client::{HttpResponse};
use futures::future::{join_all, Abortable, AbortHandle};
use tokio::sync::mpsc::{Sender, channel, Receiver};
use tokio::time::Instant;
use crate::{collector::Collector, runner::Runner, enums::TaskStatus};
use std::collections::HashMap;

#[derive(Debug)]
pub struct TaskManager {
    pub status: TaskStatus,
    pub started_at: Option<Instant>,
    tx: Sender<HttpResponse>,
    worker_count: u64,
    running_tasks: HashMap<u32, Vec<AbortHandle>>,
    base_tasks: Vec<Task>
}

impl TaskManager {
    pub fn new() -> Self {
        let (tx, rx) = channel::<HttpResponse>(10000);

        let mut task_manager = TaskManager {
            tx,
            started_at: None,
            worker_count: 0,
            status: TaskStatus::Stopped,
            running_tasks: HashMap::new(),
            base_tasks: vec!()
        };

        task_manager.start_collector(rx);

        task_manager
    }

    pub fn init_runners(&mut self, tasks: &Vec<Task>, max_worker_count: u64) {
        if TaskStatus::Stopped != self.status {
            return;
        }

        self.status = TaskStatus::Running;
        self.started_at = Some(Instant::now());
        self.worker_count = max_worker_count;

        let total_weight = tasks.iter().map(|task| {
            task.weight
        }).sum::<f32>();

        let worker_per_weight = (max_worker_count as f32) / total_weight;

        for task in tasks {
            self.base_tasks.push(task.clone());
            let task_worker_count = (task.weight * worker_per_weight).ceil() as u64;
            self.start_runner(&task.url, task_worker_count, task.id);
        }
    }

    pub fn start_runner(&mut self, url: &str, worker_count: u64, task_id: u32) {
        let mut tasks = vec!();
        let mut abort_handles = vec!();

        for _ in 0..worker_count {
            let tx_copy = self.tx.clone();

            let runner_url = url.to_owned();
            let worker = async move {
                let mut runner = Runner::new(tx_copy);
                runner.run(runner_url).await
            };

            let (abort_handle, abort_registration) = AbortHandle::new_pair();
            let abortable_task = Abortable::new(worker, abort_registration);

            abort_handles.push(abort_handle);

            let task = tokio::spawn(abortable_task);
            tasks.push(task);
        }

        self.running_tasks.insert(task_id, abort_handles);

        let _ = join_all(tasks);
    }

    pub fn stop_runner(&mut self) {
        match self.status {
            TaskStatus::Running => {
                self.status = TaskStatus::Stopped;
                self.started_at = None;


                for (_, tasks) in self.running_tasks.iter_mut() {
                    while let Some(task) = &tasks.pop() {
                        task.abort();
                    }
                }

                self.running_tasks.clear();
            },
            _ => {}
        }
    }

    fn start_collector(&mut self, rx: Receiver<HttpResponse>) {
        let _ = tokio::spawn(async move {
            Collector::listen(rx).await
        });
    }
}
