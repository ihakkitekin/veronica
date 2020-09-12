use actix_web::{http::ContentEncoding, middleware, App, HttpServer};
use env_logger::Env;
use tokio;
use actix_rt;

use crate::{server_state::create_state, routes};


pub async fn start() -> std::io::Result<()> {
    env_logger::from_env(Env::default().default_filter_or("info")).init();

    let local = tokio::task::LocalSet::new();
    let sys = actix_rt::System::run_in_tokio("server", &local);

    let state = create_state();

    let _ = HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(middleware::Compress::new(ContentEncoding::Gzip))
            .wrap(middleware::Logger::new(
                "Request: %r, Status: %s, Time: %Dms, Size: %bb, Remote-Ip: %a",
            ))
            .configure(routes::configure)
    })
    .bind("127.0.0.1:8088")?
    .run()
    .await;

    sys.await
}
