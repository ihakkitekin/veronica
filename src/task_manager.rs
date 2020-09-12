use crate::client::{HttpResponse};
use futures::future::{join_all, Abortable, AbortHandle};
use tokio::sync::mpsc::{Sender, channel, Receiver};
use tokio::time::Instant;
use crate::{collector::Collector, runner::Runner, enums::TaskStatus};

#[derive(Debug)]
pub struct TaskManager {
    pub status: TaskStatus,
    pub started_at: Option<Instant>,
    tx: Sender<HttpResponse>,
    running_tasks: Vec<AbortHandle>
}

impl<'a> TaskManager {
    pub fn new() -> Self {
        let (tx, rx) = channel::<HttpResponse>(10000);

        let mut task_manager = TaskManager {
            tx,
            started_at: None,
            status: TaskStatus::Stopped,
            running_tasks: vec!()
        };

        task_manager.start_collector(rx);

        task_manager
    }

    pub fn start_runner(&mut self, url: &str, worker_count: u64){
        match self.status {
            TaskStatus::Stopped => {
                self.status = TaskStatus::Running;
                self.started_at = Some(Instant::now());

                let mut tasks = vec!();
                for _ in 0..worker_count {
                    let tx_copy = self.tx.clone();
        
                    let runner_url = String::from(url);
                    let worker = async move {
                        let mut runner = Runner::new(tx_copy);
                        runner.run(runner_url).await
                    };
        
                    let (abort_handle, abort_registration) = AbortHandle::new_pair();
                    let abortable_task = Abortable::new(worker, abort_registration);
            
                    self.running_tasks.push(abort_handle);
        
                    let task = tokio::spawn(abortable_task);
                    tasks.push(task);
                }

                let _ = join_all(tasks);
            },
            _ => {}
        }
    }

    pub fn stop_runner(&mut self) {
        match self.status {
            TaskStatus::Running => {
                self.status = TaskStatus::Stopped;
                self.started_at = None;

                while let Some(task) = &self.running_tasks.pop() {
                    task.abort();
                }
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
