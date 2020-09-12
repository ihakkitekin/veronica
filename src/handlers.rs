use crate::STATS;
use actix_web::{HttpResponse, Responder};

pub async fn stats() -> impl Responder {
    let len;

    {
        let stats = STATS.lock().unwrap();
        len = stats.len();
    }

    HttpResponse::Ok().json(len)
}
