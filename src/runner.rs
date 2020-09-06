use crate::client::{Client, HttpResponse};
use tokio::time::{Duration, timeout};
use futures::future::{Future};

pub struct Runner {
  client: &'static Client,
  stats: Vec<HttpResponse>
}

impl Runner {
  pub fn new(client: &'static Client) -> Self {
    Runner {
      client,
      stats: Vec::new()
    }
  }

  pub async fn start(&mut self, url: &str, duration_as_secs: u64) {
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