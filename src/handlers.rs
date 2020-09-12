use crate::collector::Collector;
use crate::{server_state::ServerState};
use actix_web::{HttpResponse, Responder, web};
use serde::Deserialize;
use serde_json::json;
use tokio::time::{Instant};

pub async fn stats(data: web::Data<ServerState>) -> impl Responder {
    let status;

    #[allow(unused_assignments)]
    let mut started_at: Option<Instant> = None;

    {
        status = data.task_manager.lock().unwrap().status.clone();
        started_at = data.task_manager.lock().unwrap().started_at;
    }

    let stats = Collector::get_stats(started_at);

    let result = json!({
        "stats": stats,
        "status": status
    });

    HttpResponse::Ok().json(result)
}

pub async fn start_runner(query: web::Json<StartRunnerQuery>, data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().start_runner(&query.url, query.worker_count);
    }

    HttpResponse::Ok()
}

// TODO: Return final results
pub async fn stop_runner(data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().stop_runner();
    }

    HttpResponse::Ok()
}

pub async fn reset() -> impl Responder {
    Collector::reset();

    HttpResponse::Ok()
}

#[derive(Deserialize)]
pub struct StartRunnerQuery {
    url: String,
    worker_count: u64
}
