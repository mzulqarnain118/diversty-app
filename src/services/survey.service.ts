import { makeRequest } from "./makeRequest";

export async function getSurveys(data: any) {
  return makeRequest("/api/v1/survey");
}
export async function createSurvey(data: any) {
  return makeRequest("/api/v1/survey", "POST", data);
}

export async function getSurveyAndQuestionnaireWithSections(surveyId: string) {
  return makeRequest(`/api/v1/survey/${surveyId}`);
}

export async function getSurveyAndSections(surveyId: string) {
  return makeRequest(`/api/v1/survey/${surveyId}`);
}

export async function updateSuurvey(surveyId: string, data: any) {
  return makeRequest(`/api/v1/survey/${surveyId}`, "PATCH", data);
}

export async function deleteSurvey(surveyId: string, data: any) {
  return makeRequest(`/api/v1/survey/${surveyId}`, "DELETE", data);
}

export async function duplicateSurvey(surveyId: string, data: any) {
  return makeRequest(`/api/v1/survey/${surveyId}/duplicate`, "POST", data);
}

export async function getLibrarySurveys() {
  return makeRequest(`/api/v1/survey/library`);
}

export async function updateSequence(data: any) {
  return makeRequest(`/api/v1/question/reorder`, "PATCH", data);
}
