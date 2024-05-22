import { sendRecoveryEmail } from "@/lib/email";
import { getUserByEmail } from "@/lib/prisma/user";
import { createPasswordRecoveryLink } from "@/utils";
import { generateRecoveryToken } from "@/utils/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await getUserByEmail(email) as any;

  if (!user) {
    return NextResponse.json({
      success: false,
      msg: "User Not Found",
    });
  }

  const token = await generateRecoveryToken(user.id);

  await sendRecoveryEmail(
    user.email,
    user.name,
    createPasswordRecoveryLink(token)
  );

  return NextResponse.json({
    success: true,
    msg: "Recovery Email Sent",
  });
}
