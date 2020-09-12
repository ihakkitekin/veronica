#[macro_use]
extern crate lazy_static;

use std::sync::{Arc, Mutex};

mod client;
mod handlers;
mod runner;
mod collector;
mod task_manager;
mod server;
mod enums;
mod routes;
mod server_state;

use client::HttpResponse;

lazy_static! {
    pub static ref STATS: Arc<Mutex<Vec<HttpResponse>>> = Arc::new(Mutex::new(vec!()));
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    server::start().await
}
