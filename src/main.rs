#[macro_use]
extern crate lazy_static;

mod client;
mod handlers;
mod runner;
mod collector;
mod task_manager;
mod server;
mod enums;
mod routes;
mod server_state;
mod task;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    server::start().await
}
