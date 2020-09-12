use actix_web::{web};
use crate::{handlers};

pub fn configure(cfg: &mut web::ServiceConfig) {
  cfg.service(
      web::scope("/api")
          .route("/stats", web::get().to(handlers::stats))
          .route("/runner/start", web::get().to(handlers::start_runner))
          .route("/runner/stop", web::get().to(handlers::stop_runner))
  );
}