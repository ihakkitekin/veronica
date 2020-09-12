use crate::client::{HttpResponse};

use tokio::sync::mpsc::Receiver;
use lazy_static;
use serde::Serialize;

use std::sync::{Arc, Mutex};

lazy_static! {
    static ref RESPONSES: Arc<Mutex<Vec<HttpResponse>>> = Arc::new(Mutex::new(vec!()));
    static ref STATS: Arc<Mutex<Stats>> = Arc::new(Mutex::new(Stats::default()));
}

pub struct Collector {}

impl Collector {
    pub async fn listen(mut rx: Receiver<HttpResponse>){
        while let Some(i) = rx.recv().await {
            let mut responses = RESPONSES
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());

            Collector::process(&i);
            responses.push(i);
        }
    }

    pub fn get_stats_len() -> usize {
        let responses = RESPONSES
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());

        responses.len()
    }

    pub fn get_stats() -> Stats {
        let stats = STATS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());

        stats.clone()
    }

    fn process(response: &HttpResponse) {
        let mut stats = STATS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        
        if !response.success {
            stats.error_count += 1;
        }

        stats.average_time = (
            (stats.average_time * (stats.count as f64))
            + (response.time as f64)) 
            / ((stats.count + 1) as f64);

        stats.count += 1;
    }
}

#[derive(Clone, Serialize)]
pub struct Stats {
    count: usize,
    error_count: usize,
    average_time: f64,
    // rps: u64
}

impl Default for Stats {
    fn default() -> Stats {
        Stats {
            count: 0,
            error_count: 0,
            average_time: 0_f64
        }
    }
}
