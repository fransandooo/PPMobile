import { authFetch } from "@/src/utils/authFetch";

const TASK_BASE = "https://ppmobile.onrender.com/api/resp";

export async function fetchAssignedTasks() {
  const res = await authFetch(`${TASK_BASE}/assigned/me`);
  if (!res || !res.ok) throw new Error("Failed to fetch tasks.");
  const data = await res.json();
  return data.tasks;
}

export async function completeUserTask(taskId: string) {
  const res = await authFetch(`${TASK_BASE}/complete/${taskId}`, {
    method: "POST",
  });
  if (!res || !res.ok) throw new Error("Failed to complete task.");
  const data = await res.json();
  return data;
}
