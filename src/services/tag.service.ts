import { makeRequest } from "./makeRequest";

export async function getTags({ limit = 20, page = 1, search = "" }) {
  const params = {
    limit,
    page,
    search,
  };
  return makeRequest(`/api/v1/tag`, "GET", null, { params });
}

export async function addTags(data: any) {
  return makeRequest(`/api/v1/tag`, "POST", data);
}
