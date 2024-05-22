import { makeRequest } from "./makeRequest";

export async function addUser(data: any) {
  return makeRequest("/api/auth/register", "POST", data);
}

export async function verifyUser(token: string) {
  return makeRequest(`/api/auth/verifyUser?token=${token}`);
}

export async function regenrateVerificationLink(token: string) {
  return makeRequest(`/api/auth/verifyUser`, "PATCH", { token });
}

export async function forgotPassword(email: string) {
  return makeRequest(`/api/auth/forgotPassword`, "POST", { email });
}

export async function resetPassword(password: string, token: string) {
  return makeRequest(`/api/auth/resetPassword`, "POST", { password, token });
}
