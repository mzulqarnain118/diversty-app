import { makeRequest } from "./makeRequest";

export async function createSection(data: any) {
  return makeRequest("/api/v1/section", "POST", data);
}

export async function updateSection(sectionId: string, data: any) {
  return makeRequest(`/api/v1/section/${sectionId}`, "PATCH", data);
}

export async function deleteSection(sectionId: string) {
  return makeRequest(`/api/v1/section/${sectionId}`, "DELETE");
}
