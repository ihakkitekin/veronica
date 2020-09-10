use crate::client::{Client, HttpResponse};
use futures::future::Future;
use tokio::time::{timeout, Duration};

pub struct Runner {
    client: Client,
    stats: Vec<HttpResponse>,
}

impl Runner {
    pub fn new() -> Self {
        Runner {
            client: Client::new(),
            stats: Vec::new(),
        }
    }

    pub async fn run_with_duration(&mut self, url: &str, duration_as_secs: u64) {
        let _ = timeout(Duration::from_secs(duration_as_secs), self.run(url)).await;

        println!("{}", self.stats.len());
    }

    async fn run(&mut self, url: &str) -> Box<dyn Future<Output = ()>> {
        loop {
            let res = self.client.get(url).await;

            self.stats.push(res);
        }
    }
}
