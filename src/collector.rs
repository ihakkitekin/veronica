use crate::client::{HttpResponse};

use tokio::sync::mpsc::Receiver;
use lazy_static;

use std::sync::{Arc, Mutex};

lazy_static! {
    static ref STATS: Arc<Mutex<Vec<HttpResponse>>> = Arc::new(Mutex::new(vec!()));
}

pub struct Collector {}

impl Collector {
    pub async fn listen(mut rx: Receiver<HttpResponse>){
        while let Some(i) = rx.recv().await {
            let mut stats = STATS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());

            stats.push(i);
        }
    }

    pub fn get_stats_len() -> usize {
        let stats = STATS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());

        stats.len()
    }
}
