use crate::{STATS, server_state::ServerState};
use actix_web::{HttpResponse, Responder, web};

pub async fn stats() -> impl Responder {
    let len;

    {
        let stats = STATS.lock().unwrap();
        len = stats.len();
    }

    HttpResponse::Ok().json(len)
}

pub async fn start_runner(data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().start_runner(1);
    }

    HttpResponse::Ok()
}

pub async fn stop_runner(data: web::Data<ServerState>) -> impl Responder {
    {
        data.task_manager.lock().unwrap().stop_runner().await;
    }

    HttpResponse::Ok()
}
