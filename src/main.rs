mod server;
mod handlers;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    server::start().await
}