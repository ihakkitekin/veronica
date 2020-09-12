use crate::collector::Collector;
use crate::{server_state::ServerState};
use actix_web::{HttpResponse, Responder, web};
use serde_json::json;

pub async fn stats(data: web::Data<ServerState>) -> impl Responder {
    let stats = Collector::get_stats();
    let status;

    {
        status = data.task_manager.lock().unwrap().status.clone();
    }

    let result = json!({
        "stats": stats,
        "status": status
    });

    HttpResponse::Ok().json(result)
}

pub async fn start_runner(data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().start_runner(1);
    }

    HttpResponse::Ok()
}

pub async fn stop_runner(data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().stop_runner();
    }

    HttpResponse::Ok()
}
