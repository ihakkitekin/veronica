use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub enum TaskStatus {
  Running,
  Stopped
}