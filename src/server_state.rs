use std::sync::{Arc, Mutex};
use actix_web::web::Data;
use crate::task_manager::TaskManager;

pub struct ServerState {
  pub task_manager: Arc<Mutex<TaskManager>>
}

pub fn create_state() -> Data<ServerState> {
  let task_manager = Arc::new(Mutex::new(TaskManager::new()));

  Data::new(ServerState { 
    task_manager
  })
}