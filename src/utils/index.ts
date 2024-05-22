import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export function generateHash(payload: string) {
  return bcrypt.hash(payload, 10);
}

export function compareHash(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}

export function createSignupVerificationLink(token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_ADDRESS}/auth/verify?t=${token}`;
  return verificationLink;
}

export function createPasswordRecoveryLink(token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_ADDRESS}/auth/resetPassword?t=${token}`;
  return verificationLink;
}


export function createSurveyInvitationLink(token: string){
  return `${process.env.NEXT_PUBLIC_APP_ADDRESS}/user/response/${token}`
}

export function getUUID() {
  return uuidv4();
}
