import { makeRequest } from "./makeRequest";

export async function getCloseEndedChoiceTypes(data: any) {
  return makeRequest("/api/v1/choice/closeEnded");
}

export async function addChoice(data: any) {
  return makeRequest("/api/v1/choice", "POST", data);
}

export async function updateChoice(id: string, data: any) {
  return makeRequest(`/api/v1/choice/${id}`, "PATCH", data);
}

export async function deleteChoice(id: string) {
  return makeRequest(`/api/v1/choice/${id}`, "DELETE");
}
