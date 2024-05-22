import { generateJwtToken, verifyJwtToken } from "./jwt";
import { addToken, getToken, removeToken, removeTokenByIdentifier } from "@/lib/prisma/token";

export async function generateSignupVerificationToken(id: string) {
  const token = generateJwtToken({ id }, { expiresIn: '1h' });
  await removeTokenByIdentifier(id)
  await addToken(id, token);
  return token;
}

export async function validateSignupVerificationToken(token: string) {
  const payload = verifyJwtToken(token);
  if (payload) {
    await removeToken(token);
  }
  return payload;
}

export async function regenrateVerificationLink(oldToken: string) {
  if (!oldToken) {
    throw new Error("Old Token Is Required");
  }

  const token = await getToken(oldToken);

  if (!token) {
    throw new Error("Invalid Token!\n Signup again or Contact Support");
  }

  await removeToken(token.token);

  const newToken = await generateSignupVerificationToken(token.identifier);
  return { newToken, userId: token.identifier };
}

export async function regenrateVerificationTokenById(id: string){
  const newToken = await generateSignupVerificationToken(id);
  return {newToken, userId: id}
}

export async function generateRecoveryToken(id: string) {
  const token = generateJwtToken({ id, type: "recovery" }, {expiresIn:'1h'});
  await addToken(id, token);
  return token;
}

export async function validateRecoveryToken(token: string) {
  const t = await getToken(token);
  const payload = verifyJwtToken(token);
  if (!payload || !t) {
    return null;
  }

  return t;
}
