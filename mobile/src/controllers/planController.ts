import { authFetch } from "../utils/authFetch";

export async function createPlan(plan: {
  name: string;
  description: string;
  totalexpenses: number;
  date: string;
  location: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await authFetch("https://ppmobile.onrender.com/api/plan/create-plan", {
      method: "POST",
      body: JSON.stringify(plan),
    });

    if (!response) return { success: false, message: "Session expired." };

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to create plan" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "An error occurred while creating the plan." };
  }
}

export async function fetchUserPlans() {
  try {
    const res = await authFetch("https://ppmobile.onrender.com/api/plan/events/user");
    if (!res) throw new Error("No response from server");

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch plans");

    return data.plans;
  } catch (err) {
    console.error("❌ fetchUserPlans error:", err);
    throw err;
  }
}


const API_BASE_URL = "https://ppmobile.onrender.com/api/plan/events";

export async function fetchPlanById(planId: string) {
  try {
    const res = await authFetch(`${API_BASE_URL}/${planId}`);
    if (!res || !res.ok) return null;

    const data = await res.json();
    return data.plan;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
}

export async function assignTaskToParticipant(planId: string, userId: string, task: string, cost?: number) {
  try {
    const response = await authFetch(
      `https://ppmobile.onrender.com/api/resp/${planId}/assign`,
      {
        method: "POST",
        body: JSON.stringify({ userId, task, cost }),
      }
    );

    if (!response || !response.ok) {
      const errorData = await response?.json();
      throw new Error(errorData?.message || "Failed to assign task.");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ assignTaskToParticipant error:", err);
    throw err;
  }
}


export async function fetchTasksForPlan(planId: string) {
  const response = await authFetch(`https://ppmobile.onrender.com/api/resp/${planId}`);
  if (!response || !response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data.tasks;
}
