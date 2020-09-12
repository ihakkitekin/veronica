use crate::client::{HttpResponse};
use crate::STATS;
use tokio::sync::mpsc::Receiver;

pub struct Collector {}

impl<'a> Collector {
    pub fn new() -> Self {
        Collector {}
    }

    pub async fn listen(&'a mut self, mut rx: Receiver<HttpResponse>){
        while let Some(i) = rx.recv().await {
            let mut stats = STATS.lock().unwrap();
            stats.push(i);
        }
    }
}
