use crate::{client::{Client, HttpResponse}};
use tokio::time::{timeout, Duration};
use tokio::sync::mpsc::Sender;

pub struct Runner {
    client: Client,
    tx: Sender<HttpResponse>
}

impl Runner {
    pub fn new(tx: Sender<HttpResponse>) -> Self {
        Runner {
            tx,
            client: Client::new()
        }
    }

    pub async fn run_with_duration(&mut self, url: &str, duration_as_secs: u64) {
        let _ = timeout(Duration::from_secs(duration_as_secs), self.run(url)).await;
    }

    pub async fn run(&mut self, url: &str) {
        loop {
            let res = self.client.get(url).await;
            let _ = self.tx.send(res).await;
        }
    }
}
