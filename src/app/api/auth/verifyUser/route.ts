import ApiError from "@/errors/ApiError";
import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import { sendVerificationEmail } from "@/lib/email";
import { getUserById, verifyUser } from "@/lib/prisma/user";
import { createSignupVerificationLink } from "@/utils";
import {
  regenrateVerificationLink,
  regenrateVerificationTokenById,
  validateSignupVerificationToken,
} from "@/utils/tokens";
import { getServerSession } from "next-auth";
import httpStatus from "http-status";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx: { params: any }) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, msg: "Token Is Required" },
      { status: 400 }
    );
  }

  const payload = await validateSignupVerificationToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        msg: "The verification link broken or expired. Please request a new verification email.",
        renew: true,
      },
      { status: 401 }
    );
  }
  // mark user as verified
  await verifyUser((payload as any)?.id);

  return NextResponse.json({ success: true, msg: "Email Verified!" });
}

// regenrate new token on the basis of old link
export async function PATCH(req: NextRequest) {
  const { token } = await req.json();

  const data = await getServerSession(authOptions);

  try {
    let newToken, userId;
    if (data?.user.id) {
      ({ newToken, userId } = await regenrateVerificationTokenById(
        data?.user.id
      ));
    } else {
      if (!token)
        throw new ApiError("Token is required", httpStatus.BAD_REQUEST);
      ({ newToken, userId } = await regenrateVerificationLink(token));
    }
    const user = await getUserById(userId);
    const { email, name } = user as any;
    await sendVerificationEmail(
      email,
      name,
      createSignupVerificationLink(newToken)
    );

    return NextResponse.json({
      success: true,
      msg: "Verification link sent! please check your email",
    });
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        success: false,
        msg: (e instanceof ApiError) ? e.message : (e as Error).message || "Something Went Wrong",
      },
      { status:  (e instanceof ApiError) ? e.statusCode : 500}
    );
  }
}
