use crate::client::{HttpResponse};
use futures::future::{join_all, Abortable, AbortHandle};
use tokio::sync::mpsc::{Sender, channel, Receiver};
use crate::{collector::Collector, runner::Runner, enums::TaskState};

#[derive(Debug)]
pub struct TaskManager {
    tx: Sender<HttpResponse>,
    state: TaskState,
    running_tasks: Vec<AbortHandle>,
    test: Vec<u32>
}

impl<'a> TaskManager {
    pub fn new() -> Self {
        let (tx, rx) = channel::<HttpResponse>(10000);

        let mut task_manager = TaskManager {
            tx,
            state: TaskState::Stopped,
            running_tasks: vec!(),
            test: vec!()
        };

        task_manager.start_collector(rx);

        task_manager
    }

    pub fn start_runner(&mut self, worker_count: u32){
        if self.state == TaskState::Running {
            return;
        }

        self.state = TaskState::Running;

        let mut tasks = vec!();
        for _ in 0..worker_count {
            let tx_copy = self.tx.clone();

            let worker = async move {
                let mut runner = Runner::new(tx_copy);
                runner.run("http://localhost:3000").await
            };

            let (abort_handle, abort_registration) = AbortHandle::new_pair();
            let abortable_task = Abortable::new(worker, abort_registration);
    
            self.running_tasks.push(abort_handle);

            let task = tokio::spawn(abortable_task);
            tasks.push(task);
        }

        self.test.push(1);
        let _ = join_all(tasks);
    }

    pub fn stop_runner(&mut self) {
        if self.state == TaskState::Stopped {
            return;
        }

        self.state = TaskState::Stopped;
        
        while let Some(task) = &self.running_tasks.pop() {
            task.abort();
        }
    }

    fn start_collector(&mut self, rx: Receiver<HttpResponse>) {
        let _ = tokio::spawn(async move {
            Collector::listen(rx).await
        });
    }
}
