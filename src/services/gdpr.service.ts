import { makeRequest } from "./makeRequest";

export async function addGdpr(data: any) {
  return makeRequest(`/api/v1/user/gdpr`, "POST", data);
}

export async function createGdprTemplate(data: any) {
  return makeRequest("/api/v1/gdpr-template", "POST", data);
}

export async function getGdprTemplate() {
  return makeRequest(`/api/v1/gdpr-template`, "GET");
}
