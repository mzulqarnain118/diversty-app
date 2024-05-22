import { makeRequest } from "./makeRequest";

export async function getRespondents(surveyId: string) {
  return makeRequest(`/api/v1/survey/${surveyId}/respondent`);
}

export async function addRespondents(data: any) {
  return makeRequest(`/api/v1/respondent`, "POST", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
