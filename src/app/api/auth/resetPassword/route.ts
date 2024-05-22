import { removeToken } from "@/lib/prisma/token";
import { updateUser } from "@/lib/prisma/user";
import { generateHash } from "@/utils";
import { validateRecoveryToken } from "@/utils/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  const _token = await validateRecoveryToken(token);

  if (!_token) {
    return NextResponse.json({
      success: false,
      msg: "Invalid Token!!",
    });
  }

  const hashedPassword = await generateHash(password);

  const user = await updateUser(_token.identifier, {
    password: hashedPassword,
  });

  await removeToken(token);

  return NextResponse.json({
    success: true,
    msg: "Password Updated Successfully",
  });
}
