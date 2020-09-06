#[macro_use]
extern crate lazy_static;

use tokio;
use futures::future::join_all;


mod server;
mod handlers;
mod client;
mod runner;

lazy_static! {
    static ref CLIENT: client::Client = client::Client::new();
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let mut workers = vec!();

    for _ in  0..500 {
        let worker = tokio::spawn(async move {
            let mut runner = runner::Runner::new(&CLIENT);
            runner.start("http://localhost:3000", 5).await
        });

        workers.push(worker);
    }

    join_all(workers).await;

    Ok(())
    // server::start().await
}