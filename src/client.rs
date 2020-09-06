use reqwest::{Result as ReqResult, Response, header};
use tokio::time::{Instant};
use serde::Serialize;

const VERSION: &'static str = env!("CARGO_PKG_VERSION");


#[derive(Debug, Serialize)]
pub struct HttpResponse {
  pub status: u16,
  pub time: u128,
  pub error: String,
  pub success: bool
}

pub struct Client {
  http: reqwest::Client,
}

impl Client {
  pub fn new() -> Self {
    let mut headers = header::HeaderMap::new();
    headers.insert(header::CONNECTION, header::HeaderValue::from_static("keep-alive"));

    Client {
      http: reqwest::Client::builder()
        .user_agent(format!("Veronica v{}", VERSION))
        .gzip(true)
        .build()
        .unwrap()
    }
  }

  pub async fn get(&self, url: &str) -> HttpResponse {
    let now = Instant::now();

    let result = self.http.get(url).send().await;
    let time = now.elapsed().as_millis();

    self.to_response(result, time)
  }

  fn to_response(&self, result: ReqResult<Response>, time: u128) -> HttpResponse {
    match result {
      Ok(r) => HttpResponse {
        time,
        status: r.status().into(),
        error: match r.error_for_status_ref() {
          Ok(_res) => String::new(),
          Err(err) => err.to_string()
        },
        success: r.status().is_success(),
      },
      Err(e) => HttpResponse {
        time,
        status: match e.status(){
          Some(status) => status.into(),
          None => 0
        },
        error: e.to_string(),
        success: false,
      }
    }
  }
}