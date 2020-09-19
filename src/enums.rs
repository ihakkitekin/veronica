use serde::Serialize;

#[derive(Debug, Clone, Serialize, PartialEq)]
pub enum TaskStatus {
  Running,
  Stopped
}