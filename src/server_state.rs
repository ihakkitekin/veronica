use std::sync::Mutex;
use crate::task_manager::TaskManager;

pub struct ServerState {
  pub task_manager: Mutex<TaskManager>
}

pub fn create_state() -> ServerState {
  ServerState { task_manager: Mutex::new(TaskManager::new()) }
}