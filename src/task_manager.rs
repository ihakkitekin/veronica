use crate::client::{HttpResponse};
use futures::future::{join_all};
use tokio::sync::mpsc::{Sender, channel, Receiver};
use crate::{collector::Collector, runner::Runner};

pub struct TaskManager {
    tx: Sender<HttpResponse>
}

impl<'a> TaskManager {
    pub fn new() -> Self {
        let (tx, rx) = channel::<HttpResponse>(10000);

        let mut task_manager = TaskManager {
            tx
        };

        task_manager.start_collector(rx);

        task_manager
    }

    pub fn start_runner(&mut self, worker_count: u32, duration: u64){
        let mut tasks = vec!();
        for _ in 0..worker_count {
            let tx_copy = self.tx.clone();

            
            let worker = tokio::spawn(async move {
                let mut runner = Runner::new(tx_copy);
                runner.run_with_duration("http://localhost:3000", duration).await
            });
    
            tasks.push(worker);
        }

        let _ = join_all(tasks);
    }

    fn start_collector(&mut self, rx: Receiver<HttpResponse>) {
        let _ = tokio::spawn(async move {
            Collector::new().listen(rx).await
        });
    }
}
