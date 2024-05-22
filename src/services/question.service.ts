import { makeRequest } from "./makeRequest";

export async function createQuestion(data: any) {
  return makeRequest("/api/v1/question", "POST", data);
}
export async function getQuestionsByServey(id: string) {
  return makeRequest(`/api/v1/user/survey/${id}/question`);
}

export async function updateQuestion(questionId: string, data: any) {
  return makeRequest(`/api/v1/question/${questionId}`, "PUT", data);
}

export async function deleteQuestion(questionId: string) {
  return makeRequest(`/api/v1/question/${questionId}`, "DELETE");
}

export async function addResponcesBySurvey(surveyId: string, data: any) {
  return makeRequest(`/api/v1/survey/${surveyId}/response`, "POST", data);
}

export async function updateTags(questionId: number, data: any) {
  return makeRequest(`/api/v1/question/${questionId}/tag`, "PUT", data);
}

export async function getImportQuestions(params: {
  limit: number;
  page: number;
  search: string;
  type: "PUBLIC" | "PRIVATE";
}) {
  const { limit, page, search, type='PRIVATE' } = params;
  return makeRequest(
    `/api/v1/question/import?limit=${limit}&page=${page}&search=${search}&type=${type}`
  );
}

export async function importQuestion(
  id: string,
  surveyId: string,
  question_text: string
) {
  return makeRequest(`/api/v1/question/import`, "POST", {
    id,
    surveyId,
    question_text,
  });
}
