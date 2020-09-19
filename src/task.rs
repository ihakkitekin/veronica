use lazy_static;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

lazy_static! {
  static ref TASK_COUNT: Mutex<u32> = Mutex::new(0);
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
  pub url: String,
  pub weight: f32,

  #[serde(skip_deserializing, default = "Task::get_id")]
  pub id: u32
}

impl Task {
  pub fn get_id() -> u32 {
    let id;

    {
      let mut task_count = TASK_COUNT
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());

      *task_count += 1;
      id = *task_count;
    }

    id
  }
}