#[macro_use]
extern crate lazy_static;

use std::sync::{Arc, Mutex};

mod client;
mod handlers;
mod runner;
mod collector;
mod task_manager;
mod server;

use client::HttpResponse;
use task_manager::TaskManager;

lazy_static! {
    pub static ref STATS: Arc<Mutex<Vec<HttpResponse>>> = Arc::new(Mutex::new(vec!()));
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut task_manager = TaskManager::new();
    task_manager.start_runner(1, 1);

    server::start().await
}
