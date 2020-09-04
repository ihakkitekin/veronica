use actix_web::{Responder};

pub async fn stats() -> impl Responder {
    "Stats"
}