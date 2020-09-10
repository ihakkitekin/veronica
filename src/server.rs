use actix_web::{http::ContentEncoding, middleware, web, App, HttpServer};
use env_logger::Env;

use crate::handlers;

fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").route("/stats", web::get().to(handlers::stats)));
}

pub async fn start() -> std::io::Result<()> {
    env_logger::from_env(Env::default().default_filter_or("info")).init();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::new(ContentEncoding::Gzip))
            .wrap(middleware::Logger::new(
                "Request: %r, Status: %s, Time: %Dms, Size: %bb, Remote-Ip: %a",
            ))
            .configure(config)
    })
    .bind("127.0.0.1:8088")?
    .run()
    .await
}
