use crate::CLIENT;
use actix_web::{HttpResponse, Responder};

pub async fn stats() -> impl Responder {
    let client = &CLIENT;

    let res = client.get("https://www.rust-lang.org").await;

    HttpResponse::Ok().json(res)
}
