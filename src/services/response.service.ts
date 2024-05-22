import { makeRequest } from "./makeRequest";

export async function getResponses(id: string) {
  return makeRequest(`/api/v1/survey/${id}/response`);
}

export async function submitResponses(id: string) {
  return makeRequest(`/api/v1/user/survey/${id}/submit`, 'PATCH', {});
}

export async function addResponses(id: string, data:any) {
  return makeRequest(`/api/v1/user/survey/response/${id}`, 'PATCH', data);
}