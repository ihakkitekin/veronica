use actix_web::{web};
use crate::{handlers};

pub fn configure(cfg: &mut web::ServiceConfig) {
  cfg.service(
      web::scope("/api")
          .route("/stats", web::get().to(handlers::stats))
          .route("/runner/start", web::post().to(handlers::start_runner))
          .route("/runner/stop", web::post().to(handlers::stop_runner))
          .route("/runner/reset", web::post().to(handlers::reset))
  );
}