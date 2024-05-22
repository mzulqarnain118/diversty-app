import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export function generateJwtToken(
  payload: any,
  options?: SignOptions,
  secret: string = process.env.NEXTAUTH_SECRET as string
): string {
  return jwt.sign(payload, secret, options);
}

export function verifyJwtToken(
  token: string,
  options?: VerifyOptions,
  secret: string = process.env.NEXTAUTH_SECRET as string
) {
  try {
    const decoded = jwt.verify(token, secret, options);
    return decoded;
  } catch (error) {
    return null;
  }
}
