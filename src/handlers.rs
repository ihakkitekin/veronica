use crate::collector::Collector;
use crate::{server_state::ServerState};
use actix_web::{HttpResponse, Responder, web};

pub async fn stats() -> impl Responder {
    let stats = Collector::get_stats();

    HttpResponse::Ok().json(stats)
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
